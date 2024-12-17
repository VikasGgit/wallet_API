// controllers/userController.js
import prisma from '../prisma/prismaClient.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, role },
    });

      const userId=user.id;
      let balance=0.0;
    const wallet = await prisma.wallet.create({
      data: { userId, balance },
    });
    res.status(201).json({ message: 'User registered successfully', user, wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password,} = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
