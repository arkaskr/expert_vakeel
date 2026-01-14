// routes/adminRoutes.js
import express from 'express';
import {
  createAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  deleteAllAdmins,
} from '../controllers/adminController.js';

const router = express.Router();

// Clean REST paths under /api/admins
router.post('/', createAdmin);
router.post('/login', loginAdmin);
router.get('/', getAllAdmins);
router.get('/:id', getAdminById);
router.put('/:id', updateAdminById);     // replace all fields
router.delete('/:id', deleteAdminById);
router.delete('/', deleteAllAdmins);     // DANGER: delete all

export default router;
