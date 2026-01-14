// routes/subAdminRoutes.js
import express from 'express';
import {
  createSubAdmin,
  loginSubAdmin,
  getAllSubAdmins,
  getSubAdminById,
  updateSubAdminById,
  deleteSubAdminById,
  deleteAllSubAdmins,
} from '../controllers/subAdminController.js';

const router = express.Router();

// Clean REST paths under /api/subAdmins
router.post('/', createSubAdmin);
router.post('/login', loginSubAdmin);
router.get('/', getAllSubAdmins);
router.get('/:id', getSubAdminById);
router.put('/:id', updateSubAdminById);     // replace all fields
router.delete('/:id', deleteSubAdminById);
router.delete('/', deleteAllSubAdmins);     // DANGER: delete all

export default router;
