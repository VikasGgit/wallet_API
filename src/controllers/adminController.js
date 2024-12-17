// controllers/adminController.js
import prisma from '../prisma/prismaClient.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { wallets: true },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Reset User Credentials
export const resetUserCredentials = async (req, res) => {
  try {
    const { userId } = req.params;

    // Generate a temporary password
    const tempPassword = uuidv4().split('-')[0]; // Short temp password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({
      message: 'User credentials reset successfully',
      tempPassword, // Share this with the user securely
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
