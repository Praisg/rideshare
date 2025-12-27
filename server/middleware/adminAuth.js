import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';
import Admin from '../models/Admin.js';

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    const admin = await Admin.findById(payload.id);
    
    if (!admin || !admin.isActive) {
      throw new UnauthenticatedError('Admin not found or inactive');
    }

    req.admin = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export default adminAuth;

