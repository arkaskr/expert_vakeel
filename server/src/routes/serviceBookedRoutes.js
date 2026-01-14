// routes/serviceBookedRoutes.js
import { Router } from "express";
import {
    createServiceBooked,
    getServiceBookedById,
    listServicesBooked,
    getServiceBookedByClientId,
    updateServiceBookedById,
    deleteServiceBookedById,
    deleteAllServicesBooked,
} from "../controllers/serviceBookedController.js";

const router = Router();

router.post("/", createServiceBooked);
router.get("/", listServicesBooked);
router.get("/client/:clientId", getServiceBookedByClientId);
router.get("/:id", getServiceBookedById);
router.put("/:id", updateServiceBookedById);
router.delete("/:id", deleteServiceBookedById);
router.delete("/", deleteAllServicesBooked);

export default router;
