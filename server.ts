import "dotenv/config";
import express from "express";
import path from "path";
import compression from "compression";
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

// No helper needed here anymore, we'll do it inline for maximum safety and performance

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
    transformation: [{ width: 800, crop: 'limit' }] // Auto-resize for efficiency
  } as any,
});

const upload = multer({ storage });

async function startServer() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const app = express();
  const PORT = Number(process.env.PORT) || 3001;

  app.use(express.json());
  app.use(compression());
  
  // Serve static files from public/uploads
  app.use("/uploads", express.static(uploadDir));

  // Site Config API (Priority)
  app.get("/api/config", async (req, res) => {
    console.log("GET /api/config called");
    try {
      const config = await (prisma as any).siteConfig.upsert({
        where: { id: "default" },
        update: {},
        create: { id: "default" }
      });
      return res.json(config);
    } catch (error) {
      console.error("Error in GET /api/config:", error);
      // Return a default config object instead of failing
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

  app.put("/api/config", async (req, res) => {
    console.log("PUT /api/config called", req.body);
    try {
      const config = await (prisma as any).siteConfig.update({
        where: { id: "default" },
        data: req.body
      });
      res.json(config);
    } catch (error) {
      console.error("Error in PUT /api/config:", error);
      res.status(500).json({ error: "Failed to update config" });
    }
  });

  // Upload API
  app.post("/api/upload", upload.array("files"), (req, res) => {
    const files = req.files as any[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const urls = files.map(file => file.path || file.secure_url);
    res.json({ urls });
  });

  // API Routes
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

  app.post("/api/stores", async (req, res) => {
    try {
      const store = await prisma.store.create({
        data: req.body
      });
      res.json(store);
    } catch (error) {
      res.status(500).json({ error: "Failed to create store" });
    }
  });

  app.put("/api/stores/:id", async (req, res) => {
    try {
      const store = await prisma.store.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(store);
    } catch (error) {
      res.status(500).json({ error: "Failed to update store" });
    }
  });

  app.delete("/api/stores/:id", async (req, res) => {
    try {
      await prisma.store.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete store" });
    }
  });

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

  app.post("/api/products", async (req, res) => {
    try {
      const product = await prisma.product.create({
        data: req.body
      });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      await prisma.product.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Promotions API
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

  app.post("/api/promotions", async (req, res) => {
    try {
      const promotion = await prisma.promotion.create({
        data: req.body
      });
      res.json(promotion);
    } catch (error) {
      res.status(500).json({ error: "Failed to create promotion" });
    }
  });

  app.delete("/api/promotions/:id", async (req, res) => {
    try {
      await prisma.promotion.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete promotion" });
    }
  });

  // Events API
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

  app.post("/api/events", async (req, res) => {
    try {
      const event = await prisma.mallEvent.create({
        data: req.body
      });
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      await prisma.mallEvent.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Vite middleware for development
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

  // Reset Database API
  app.post("/api/reset", async (req, res) => {
    try {
      // Deleting stores will automatically delete products, reviews, etc. because of Cascade Delete
      await prisma.store.deleteMany({});
      await prisma.promotion.deleteMany({});
      await prisma.mallEvent.deleteMany({});
      // Clear config if needed, or keep it
      res.json({ success: true, message: "Database cleared successfully" });
    } catch (error) {
      console.error("Reset failed:", error);
      res.status(500).json({ error: "Failed to reset database" });
    }
  });

  // Diagnostics route
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "online", 
      env: process.env.NODE_ENV,
      port: PORT,
      storage: process.env.CLOUDINARY_CLOUD_NAME ? 'Cloudinary' : 'Local'
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[China Economic Mall] Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[China Economic Mall] Listening on port ${PORT}`);
  });
}

startServer();
