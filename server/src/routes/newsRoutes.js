// routes/newsRoutes.js
import { Router } from "express";
import {
  createNews,
  getNewsById,
  listNews,
  updateNewsById,
  deleteNewsById,
  deleteAllNews,
  incrementViews,
} from "../controllers/newsPostcontroller.js";

const router = Router();

router.post("/", createNews);
router.get("/", listNews);
router.get("/:id", getNewsById);
router.put("/:id", updateNewsById);
router.delete("/:id", deleteNewsById);
router.delete("/", deleteAllNews);
router.post("/:id/views/increment", incrementViews); // optional

export default router;
