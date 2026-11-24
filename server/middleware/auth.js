import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function authenticate(request, response, next) {
  try {
    const header = request.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return response.status(401).json({ message: 'Authentication required' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('-password');

    if (!user || !user.isActive) {
      return response.status(401).json({ message: 'User is not available' });
    }

    request.user = user;
    return next();
  } catch (_error) {
    return response.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function authorize(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ message: 'Access denied' });
    }

    return next();
  };
}
