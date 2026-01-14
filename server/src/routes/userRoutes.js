// routes/userRoutes.js
import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  deleteAllUsers,
} from '../controllers/userController.js';

const router = express.Router();

// Clean REST paths under /api/users
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);     // replace all fields
router.delete('/:id', deleteUserById);
router.delete('/', deleteAllUsers);     // DANGER: delete all

export default router;
