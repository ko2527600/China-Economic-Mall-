import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3001;

  app.use(express.json());
  
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
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const urls = files.map(file => `/uploads/${file.filename}`);
    res.json({ urls });
  });

  // API Routes
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await prisma.store.findMany({
        include: { 
          products: true,
          reviews: true
        }
      });
      res.json(stores);
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
      res.json(products);
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
