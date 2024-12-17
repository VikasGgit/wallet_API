// routes/adminRoutes.js
import express from 'express';
import {
  getAllUsers,
  deleteUser,
  resetUserCredentials,
} from '../controllers/adminController.js';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { resetCredentialsSchema } from '../validations/adminValidations.js';

const router = express.Router();

// Get All Users
router.get('/users', authenticate, authorizeAdmin, getAllUsers);

// Delete User
router.delete('/users/:id', authenticate, authorizeAdmin, deleteUser);

// Reset User Credentials
router.post(
  '/users/:userId/reset-credentials',
  authenticate,
  authorizeAdmin,
  validate(resetCredentialsSchema),
  resetUserCredentials
);

export default router;
