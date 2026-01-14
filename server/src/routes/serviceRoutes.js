// routes/serviceRoutes.js
import { Router } from "express";
import {
    createService,
    getServiceById,
    listServices,
    updateServiceById,
    deleteServiceById,
    deleteAllServices,
} from "../controllers/serviceController.js";

const router = Router();

router.post("/", createService);
router.get("/", listServices);
router.get("/:id", getServiceById);
router.put("/:id", updateServiceById);
router.delete("/:id", deleteServiceById);
router.delete("/", deleteAllServices);

export default router;
