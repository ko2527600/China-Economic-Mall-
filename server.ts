import "dotenv/config";
import express from "express";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'china-mall',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, crop: 'limit' }]
  } as any,
});

const upload = multer({ storage });

// ============================================================
// SECURITY: Input sanitization — strip HTML/script tags
// ============================================================
const sanitizeString = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").trim();
};

// Only allow known string fields to be sanitized; other types pass through
const sanitizePayload = (data: Record<string, unknown>, stringFields: string[]): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (stringFields.includes(key)) {
      cleaned[key] = sanitizeString(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

// ============================================================
// SECURITY: Admin authentication middleware
//
// Set the ADMIN_SECRET env var on Render to protect endpoints.
// When unset, the app works as before (for development).
// ============================================================
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    // No secret configured — allow for dev, but warn in logs
    console.warn("[WARN] ADMIN_SECRET not set — admin endpoint is open!");
    return next();
  }
  const provided = req.headers["x-admin-secret"] as string | undefined;
  if (!provided || provided !== secret) {
    return res.status(401).json({ error: "Unauthorized — admin access required" });
  }
  next();
};

// ============================================================
// SECURITY: Validate required fields for store creation/update
// ============================================================
const validateStore = (data: Record<string, unknown>): string | null => {
  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    return "Store name is required (min 2 characters)";
  }
  if (!data.category || typeof data.category !== "string") {
    return "Store category is required";
  }
  if (!data.description || typeof data.description !== "string" || data.description.trim().length < 5) {
    return "Store description is required (min 5 characters)";
  }
  return null;
};

// ============================================================
// SECURITY: Validate required fields for product creation/update
// ============================================================
const validateProduct = (data: Record<string, unknown>): string | null => {
  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    return "Product name is required (min 2 characters)";
  }
  if (!data.price || typeof data.price !== "string" || data.price.trim().length === 0) {
    return "Product price is required";
  }
  if (!data.storeId || typeof data.storeId !== "string" || data.storeId.trim().length === 0) {
    return "Product storeId is required";
  }
  return null;
};

// ============================================================
// SECURITY: Validate required fields for promotion creation
// ============================================================
const validatePromotion = (data: Record<string, unknown>): string | null => {
  if (!data.title || typeof data.title !== "string" || data.title.trim().length < 2) {
    return "Promotion title is required (min 2 characters)";
  }
  if (!data.storeId || typeof data.storeId !== "string" || data.storeId.trim().length === 0) {
    return "Promotion storeId is required";
  }
  return null;
};

// ============================================================
// SECURITY: Validate required fields for event creation
// ============================================================
const validateEvent = (data: Record<string, unknown>): string | null => {
  if (!data.title || typeof data.title !== "string" || data.title.trim().length < 2) {
    return "Event title is required (min 2 characters)";
  }
  return null;
};

async function startServer() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const app = express();
  const PORT = Number(process.env.PORT) || 3001;

  // ============================================================
  // SECURITY: Disable Express fingerprinting + add security headers
  // ============================================================
  app.disable("x-powered-by");
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for now — SPA with inline scripts
    crossOriginEmbedderPolicy: false,
  }));

  app.use(express.json());
  app.use(compression());

  // Serve static files from public/uploads
  app.use("/uploads", express.static(uploadDir));

  // ============================================================
  // API ROUTES — must be defined BEFORE the catch-all SPA route
  // ============================================================

  // --- Diagnostics (safe to expose) ---
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      env: process.env.NODE_ENV,
      port: PORT,
      storage: process.env.CLOUDINARY_CLOUD_NAME ? 'Cloudinary' : 'Local'
    });
  });

  // --- Site Config API ---
  app.get("/api/config", async (req, res) => {
    try {
      const config = await (prisma as any).siteConfig.upsert({
        where: { id: "default" },
        update: {},
        create: { id: "default" }
      });
      return res.json(config);
    } catch (error) {
      console.error("Error in GET /api/config:", error);
      return res.json({
        id: "default",
        heroTitle: "China Economic Mall",
        heroSubtitle: "Accra's Premier Trade Destination",
        heroDescription: "Hundreds of stores. Unbeatable prices.",
        heroVideo: "/Mall 1.mp4",
        promoTitle: "Mid-Year Mega Sale",
        promoSubtitle: "Promotion",
        promoDiscount: "40%",
        loyaltyTitle: "Join Our Gold Rewards Tier",
        loyaltyDescription: "Earn points on every purchase...",
        contactPhone: "020 275 1082",
        contactAddress: "Darkuman, Accra, Ghana",
        openingHours: "07:30 - 21:30 DAILY"
      });
    }
  });

  // SECURITY: PUT config requires admin auth + input sanitization
  app.put("/api/config", requireAdmin, async (req, res) => {
    console.log("PUT /api/config called", req.body);
    try {
      const allowedFields = [
        "heroTitle", "heroSubtitle", "heroDescription", "heroImages", "heroVideo",
        "promoTitle", "promoSubtitle", "promoDiscount", "promoImage",
        "loyaltyTitle", "loyaltyDescription",
        "contactPhone", "contactAddress", "openingHours"
      ];
      const stringFields = allowedFields.filter(f => f !== "heroImages");
      const sanitized = sanitizePayload(req.body, stringFields);
      // Only allow whitelisted fields
      const cleanData: Record<string, unknown> = {};
      for (const field of allowedFields) {
        if (sanitized[field] !== undefined) {
          cleanData[field] = sanitized[field];
        }
      }
      const config = await (prisma as any).siteConfig.update({
        where: { id: "default" },
        data: cleanData
      });
      res.json(config);
    } catch (error) {
      console.error("Error in PUT /api/config:", error);
      res.status(500).json({ error: "Failed to update config" });
    }
  });

  // --- Upload API ---
  app.post("/api/upload", requireAdmin, upload.array("files"), (req, res) => {
    const files = req.files as any[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const urls = files.map(file => file.path || file.secure_url);
    res.json({ urls });
  });

  // --- Stores API ---
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await prisma.store.findMany({
        include: {
          products: true,
          promotions: true,
          reviews: true
        }
      });
      const json = JSON.stringify(stores);
      const optimized = json.replace(/w=\d+/g, 'w=400');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(optimized);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stores" });
    }
  });

  // SECURITY: POST store requires auth + validation + sanitization
  app.post("/api/stores", requireAdmin, async (req, res) => {
    try {
      const error = validateStore(req.body);
      if (error) return res.status(400).json({ error });

      const stringFields = ["name", "category", "description", "logo", "location", "hours", "phone", "image"];
      const sanitized = sanitizePayload(req.body, stringFields);
      // Whitelist allowed fields
      const cleanData: Record<string, unknown> = {};
      const allowedFields = ["name", "category", "description", "logo", "location", "hours", "phone", "rating", "image", "gallery", "isFeatured"];
      for (const field of allowedFields) {
        if (sanitized[field] !== undefined) {
          cleanData[field] = sanitized[field];
        }
      }

      const store = await prisma.store.create({ data: cleanData });
      res.json(store);
    } catch (error: any) {
      console.error("Error creating store:", error);
      res.status(500).json({ error: error.message || "Failed to create store" });
    }
  });

  // SECURITY: PUT store requires auth + validation + sanitization
  app.put("/api/stores/:id", requireAdmin, async (req, res) => {
    try {
      const stringFields = ["name", "category", "description", "logo", "location", "hours", "phone", "image"];
      const sanitized = sanitizePayload(req.body, stringFields);
      const cleanData: Record<string, unknown> = {};
      const allowedFields = ["name", "category", "description", "logo", "location", "hours", "phone", "rating", "image", "gallery", "isFeatured"];
      for (const field of allowedFields) {
        if (sanitized[field] !== undefined) {
          cleanData[field] = sanitized[field];
        }
      }

      const store = await prisma.store.update({
        where: { id: req.params.id },
        data: cleanData
      });
      res.json(store);
    } catch (error: any) {
      console.error("Error updating store:", error);
      res.status(500).json({ error: error.message || "Failed to update store" });
    }
  });

  // SECURITY: DELETE store requires auth
  app.delete("/api/stores/:id", requireAdmin, async (req, res) => {
    try {
      await prisma.store.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete store" });
    }
  });

  // --- Products API ---
  app.get("/api/products", async (req, res) => {
    try {
      const products = await prisma.product.findMany({
        include: { store: true }
      });
      const json = JSON.stringify(products);
      const optimized = json.replace(/w=\d+/g, 'w=400');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(optimized);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // SECURITY: POST product requires auth + validation + sanitization
  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const error = validateProduct(req.body);
      if (error) return res.status(400).json({ error });

      const stringFields = ["name", "price", "category", "image", "description"];
      const sanitized = sanitizePayload(req.body, stringFields);
      const cleanData: Record<string, unknown> = {};
      const allowedFields = ["name", "price", "category", "image", "description", "isNewArrival", "storeId"];
      for (const field of allowedFields) {
        if (sanitized[field] !== undefined) {
          cleanData[field] = sanitized[field];
        }
      }

      const product = await prisma.product.create({ data: cleanData });
      res.json(product);
    } catch (error: any) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: error.message || "Failed to create product" });
    }
  });

  // SECURITY: PUT product requires auth + validation + sanitization
  app.put("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const stringFields = ["name", "price", "category", "image", "description"];
      const sanitized = sanitizePayload(req.body, stringFields);
      const cleanData: Record<string, unknown> = {};
      const allowedFields = ["name", "price", "category", "image", "description", "isNewArrival"];
      for (const field of allowedFields) {
        if (sanitized[field] !== undefined) {
          cleanData[field] = sanitized[field];
        }
      }

      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: cleanData
      });
      res.json(product);
    } catch (error: any) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: error.message || "Failed to update product" });
    }
  });

  // SECURITY: DELETE product requires auth
  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      await prisma.product.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete product" });
    }
  });

  // --- Promotions API ---
  app.get("/api/promotions", async (req, res) => {
    try {
      const promotions = await prisma.promotion.findMany({
        include: { store: true }
      });
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch promotions" });
    }
  });

  // SECURITY: POST promotion requires auth + validation + sanitization
  app.post("/api/promotions", requireAdmin, async (req, res) => {
    try {
      const error = validatePromotion(req.body);
      if (error) return res.status(400).json({ error });

      const stringFields = ["title", "description", "image"];
      const sanitized = sanitizePayload(req.body, stringFields);
      const cleanData: Record<string, unknown> = {};
      const allowedFields = ["title", "description", "image", "expirationDate", "storeId"];
      for (const field of allowedFields) {
        if (sanitized[field] !== undefined) {
          cleanData[field] = sanitized[field];
        }
      }

      const promotion = await prisma.promotion.create({ data: cleanData });
      res.json(promotion);
    } catch (error: any) {
      console.error("Error creating promotion:", error);
      res.status(500).json({ error: error.message || "Failed to create promotion" });
    }
  });

  // SECURITY: DELETE promotion requires auth
  app.delete("/api/promotions/:id", requireAdmin, async (req, res) => {
    try {
      await prisma.promotion.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete promotion" });
    }
  });

  // --- Events API ---
  app.get("/api/events", async (req, res) => {
    try {
      const events = await prisma.mallEvent.findMany({
        orderBy: { date: 'asc' }
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // SECURITY: POST event requires auth + validation + sanitization
  app.post("/api/events", requireAdmin, async (req, res) => {
    try {
      const error = validateEvent(req.body);
      if (error) return res.status(400).json({ error });

      const stringFields = ["title", "description", "image", "location"];
      const sanitized = sanitizePayload(req.body, stringFields);
      const cleanData: Record<string, unknown> = {};
      const allowedFields = ["title", "description", "image", "date", "location"];
      for (const field of allowedFields) {
        if (sanitized[field] !== undefined) {
          cleanData[field] = sanitized[field];
        }
      }

      const event = await prisma.mallEvent.create({ data: cleanData });
      res.json(event);
    } catch (error: any) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: error.message || "Failed to create event" });
    }
  });

  // SECURITY: DELETE event requires auth
  app.delete("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      await prisma.mallEvent.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete event" });
    }
  });

  // ============================================================
  // SECURITY: Reset database — requires admin auth
  // Moved ABOVE the catch-all route to prevent route shadowing
  // ============================================================
  app.post("/api/reset", requireAdmin, async (req, res) => {
    try {
      await prisma.store.deleteMany({});
      await prisma.promotion.deleteMany({});
      await prisma.mallEvent.deleteMany({});
      res.json({ success: true, message: "Database cleared successfully" });
    } catch (error) {
      console.error("Reset failed:", error);
      res.status(500).json({ error: "Failed to reset database" });
    }
  });

  // ============================================================
  // SPA catch-all — MUST be last
  // ============================================================
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[China Economic Mall] Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[China Economic Mall] Listening on port ${PORT}`);
    if (process.env.ADMIN_SECRET) {
      console.log(`[China Economic Mall] 🔒 Admin auth ENABLED`);
    } else {
      console.log(`[China Economic Mall] ⚠️  ADMIN_SECRET not set — admin endpoints are OPEN. Set it on Render now!`);
    }
  });
}

startServer();
