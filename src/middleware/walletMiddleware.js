// middleware/walletMiddleware.js
import prisma from '../prisma/prismaClient.js';

export const checkWalletStatus = async (req, res, next) => {
  const { walletId } = req.params;

  try {
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet)
      return res.status(404).json({ message: 'Wallet not found' });

    if (wallet.status === 'FROZEN') {
      return res
        .status(403)
        .json({ message: 'Wallet is frozen and cannot perform this operation' });
    }

    req.wallet = wallet; // Attach wallet to request for further use
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
