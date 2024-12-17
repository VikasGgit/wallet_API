// controllers/walletController.js
import prisma from '../prisma/prismaClient.js';

// Create Wallet
export const getWallet = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized or userId missing' });
    }

    const { userId } = req.user;

    // Check if wallet exists
    const wallet = await prisma.wallet.findFirst({ where: { userId },
      include: {
        transactions: true, // Include all transactions associated with the wallet
      },
    });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.status(200).json({ message: 'Wallet found', wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// Get All Wallets (Admin)
export const getWallets = async (req, res) => {
  try {
    const wallets = await prisma.wallet.findMany({
      include: { user: true, transactions: true },
    });
    res.json(wallets);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Update Wallet Balance
export const updateWalletBalance = async (req, res) => {
  try {
    const { walletId } = req.params;
    const { amount, operation, category } = req.body;

    // Wallet is already fetched and attached by middleware
    const wallet = req.wallet;

    let newBalance = wallet.balance;

    // Perform add or subtract operation
    if (operation === 'add') {
      newBalance += amount;
    } else if (operation === 'subtract') {
      if (wallet.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      newBalance -= amount;
    } else {
      return res
        .status(400)
        .json({ message: "Invalid operation. Use 'add' or 'subtract'." });
    }

    // Use Prisma transaction to ensure atomicity
    const [updatedWallet, newTransaction] = await prisma.$transaction([
      // Update the wallet balance
      prisma.wallet.update({
        where: { id: walletId },
        data: { balance: newBalance },
      }),
      // Log the transaction
      prisma.transaction.create({
        data: {
          walletId,
          type: operation === 'add' ? 'CREDIT' : 'DEBIT',
          amount,
          category: category || 'wallet_update',
          recurring: false,
        },
      }),
    ]);

    res.json({
      message: `Wallet ${operation}ed successfully`,
      wallet: updatedWallet,
      transaction: newTransaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Wallet
export const deleteWallet = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.wallet.delete({ where: { id } });
    res.json({ message: 'Wallet deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Add Balance
export const addBalance = async (req, res) => {
  try {
    const { walletId } = req.params; // Assuming walletId is in params
    const { amount } = req.body;

    // Wallet is already fetched and attached by middleware
    const wallet = req.wallet;

    const updatedWallet = await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    res.json({ message: 'Balance added successfully', wallet: updatedWallet });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Subtract Balance
export const subtractBalance = async (req, res) => {
  try {
    const { walletId } = req.params; // Assuming walletId is in params
    const { amount } = req.body;

    // Wallet is already fetched and attached by middleware
    const wallet = req.wallet;

    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    res.json({
      message: 'Balance subtracted successfully',
      wallet: updatedWallet,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Toggle Wallet Status (Freeze/Unfreeze)
export const toggleWalletStatus = async (req, res) => {
  try {
    const { walletId } = req.params;

    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet)
      return res.status(404).json({ message: 'Wallet not found' });

    const newStatus = wallet.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';

    const updatedWallet = await prisma.wallet.update({
      where: { id: walletId },
      data: { status: newStatus },
    });

    res.json({
      message: `Wallet ${newStatus === 'ACTIVE' ? 'unfrozen' : 'frozen'} successfully`,
      wallet: updatedWallet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
