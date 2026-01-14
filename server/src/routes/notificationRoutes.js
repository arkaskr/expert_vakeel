// routes/notificationRoutes.js
import { Router } from "express";
import {
  createNotification,
  getNotificationById,
  listNotifications,
  updateNotificationById,
  deleteNotificationById,
  deleteAllNotifications,
} from "../controllers/notificationController.js";

const router = Router();

router.post("/", createNotification);
router.get("/", listNotifications);
router.get("/:id", getNotificationById);
router.put("/:id", updateNotificationById);
router.delete("/:id", deleteNotificationById);
router.delete("/", deleteAllNotifications);

export default router;
