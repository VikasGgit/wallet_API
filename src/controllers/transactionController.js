// controllers/transactionController.js
import prisma from '../prisma/prismaClient.js';

// Create Transaction
export const createTransaction = async (req, res) => {
  try {
    const { walletId, type, amount, category, recurring } = req.body;

    // Validate transaction type
    if (!['CREDIT', 'DEBIT'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    // Check if wallet exists
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet)
      return res.status(404).json({ message: 'Wallet not found' });

    // If DEBIT, check balance
    if (type === 'DEBIT' && wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const transaction = await prisma.transaction.create({
      data: { walletId, type, amount, category, recurring },
    });

    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Get All Transactions (Admin)
export const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { wallet: true },
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Update Transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category, recurring } = req.body;

    // If updating type, validate it
    if (type && !['CREDIT', 'DEBIT'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

  const transaction = await prisma.transaction.update({
      where: { id },
      data: { type, amount, category, recurring },
    });

    res.json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Delete Transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.transaction.delete({ where: { id } });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};


// controllers/transactionController.js

// Get Transactions for Normal User (Only their own transactions)
export const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.user;  // `userId` from the authenticate middleware

    // Fetch transactions only for the authenticated user's wallet(s)
    const transactions = await prisma.transaction.findMany({
      where: {
        wallet: {
          userId: userId,  // Filter transactions to only the user's wallet(s)
        },
      },
      include: {
        wallet: true,  // Include wallet details for each transaction
      },
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
