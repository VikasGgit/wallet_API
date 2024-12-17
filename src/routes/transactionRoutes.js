// routes/transactionRoutes.js
import express from 'express';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getUserTransactions,
} from '../controllers/transactionController.js';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Transaction
router.post('/', authenticate,  createTransaction);

// Get All Transactions (Admin)
router.get('/all', authenticate, authorizeAdmin, getTransactions);

// Update Transaction (Admin)
router.put('/:id', authenticate, authorizeAdmin, updateTransaction);

// Delete Transaction (Admin)
router.delete('/:id', authenticate, authorizeAdmin, deleteTransaction);


router.get('/', authenticate, getUserTransactions);

export default router;
