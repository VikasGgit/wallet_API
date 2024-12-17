// routes/walletRoutes.js
import express from 'express';
import {
  createWallet,
  getWallets,
  updateWalletBalance,
  deleteWallet,
  addBalance,
  subtractBalance,
  toggleWalletStatus,
} from '../controllers/walletController.js';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import { checkWalletStatus } from '../middleware/walletMiddleware.js';

const router = express.Router();

// Create Wallet (Admin or Self)
router.post('/', authenticate, createWallet);

// Get All Wallets (Admin)
router.get('/', authenticate, authorizeAdmin, getWallets);

// Update Wallet Balance
router.put(
  '/:walletId/balance',
  authenticate,

  checkWalletStatus,
  updateWalletBalance
);

// Delete Wallet (Admin)
router.delete('/:id', authenticate, authorizeAdmin, deleteWallet);

// Add Balance
router.post(
  '/:walletId/add',
  authenticate,
  checkWalletStatus,
  addBalance
);

// Subtract Balance
router.post(
  '/:walletId/subtract',
  authenticate,
  checkWalletStatus,
  subtractBalance
);

// Toggle Wallet Status (Freeze/Unfreeze) (Admin)
router.put(
  '/:walletId/status',
  authenticate,
  authorizeAdmin,
  toggleWalletStatus
);

export default router;
