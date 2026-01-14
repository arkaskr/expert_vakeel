// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "./config/firebase.js"; // initialize firebase

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../swagger.json"), "utf8")
);

// ---- Routes (union of both changes) ----
import supportRoutes from "./routes/supportRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import queryAnswerRoutes from "./routes/queryAnswerRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import subAdminRoutes from "./routes/subAdminRoutes.js";
import ratingReviewRoutes from "./routes/ratingReviewRoutes.js";
import clientContactRoutes from "./routes/clientContactRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import serviceBookedRoutes from "./routes/serviceBookedRoutes.js";
import deleteRequestRoutes from "./routes/deleteRequestRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser()); // Parse cookies

// ---- CORS (merged + dev-friendly) ----
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "https://legal-backend-seven.vercel.app",
  "https://legal-admin-two.vercel.app",
  "https://expert-vakeel.vercel.app", // no trailing slash
];

app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
  })
);

// ---- Simple request logger ----
app.use((req, _res, next) => {
  const bodyInfo =
    req.body && Object.keys(req.body).length > 0 ? req.body : "no body";
  console.log(`${req.method} ${req.url} - ${JSON.stringify(bodyInfo)}`);
  next();
});

// ---- Root route ----
app.get("/", (_req, res) => {
  return res.json({
    message: "Legal Backend API",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      clients: "/api/clients",
      cases: "/api/cases",
      support: "/api/support",
      queries: "/api/queries",
      "query-answers": "/api/query-answers",
      news: "/api/news",
      blogs: "/api/blogs",
      notifications: "/api/notifications",
      admins: "/api/admins",
      subAdmins: "/api/subAdmins",
      "ratings-reviews": "/api/ratings-reviews",
      "client-contacts": "/api/client-contacts",
      services: "/api/services",
      "services-booked": "/api/services-booked",
      "delete-requests": "/api/delete-requests",
      protected: "/api/protected",
    },
  });
});

// ---- Swagger ----
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ---- Favicon (no content) ----
app.get("/favicon.ico", (_req, res) => res.status(204).end());

// ---- Register routes (union) ----
app.use("/api/users", userRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/query-answers", queryAnswerRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/subAdmins", subAdminRoutes);
app.use("/api/ratings-reviews", ratingReviewRoutes);
app.use("/api/client-contacts", clientContactRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/services-booked", serviceBookedRoutes);
app.use("/api/delete-requests", deleteRequestRoutes);

// ---- Example unprotected endpoint ----
app.get("/api/protected", (_req, res) => {
  return res.json({
    message: "Unprotected endpoint — use /api/auth/me for protected info.",
  });
});

// ---- 404 ----
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

// ---- Server ----
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
