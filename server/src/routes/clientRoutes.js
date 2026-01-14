// routes/clientRoutes.js
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createClient,
  loginClient,
  logoutClient,
  getClientById,
  listClients,
  updateClientById,
  deleteClientById,
  deleteAllClients,
} from "../controllers/clientcontroller.js";

const router = Router();

// Create + Auth
router.post("/", createClient);
router.post("/login", loginClient);
router.post("/logout", logoutClient);
router.get("/me", authenticate, (req, res) => {
  res.json({ success: true, data: req.client });
});

// Read
router.get("/", listClients);
router.get("/:id", getClientById);

// Update (all fields supported; password re-hashed if provided)
router.put("/:id", updateClientById);

// Delete
router.delete("/:id", deleteClientById);
router.delete("/", deleteAllClients);

export default router;
