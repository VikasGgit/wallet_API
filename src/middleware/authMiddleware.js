// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

// Authentication Middleware
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: 'Unauthorized: No token provided' });

  const token = authHeader.split(' ')[1]; // Assuming Bearer Token

  if (!token)
    return res.status(401).json({ message: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    req.user = decoded; // Attach decoded payload to request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Authorization Middleware for Admins
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden: Admin access only' });
  }
  next();
};
