// routes/blogRoutes.js
import { Router } from "express";
import {
  createBlog,
  getBlogById,
  listBlogs,
  updateBlogById,
  deleteBlogById,
  deleteAllBlogs,
} from "../controllers/blogController.js";

const router = Router();

router.post("/", createBlog);
router.get("/", listBlogs);
router.get("/:id", getBlogById);
router.put("/:id", updateBlogById);
router.delete("/:id", deleteBlogById);
router.delete("/", deleteAllBlogs);

export default router;
