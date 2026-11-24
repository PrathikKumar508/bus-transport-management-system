import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function register(request, response) {
  try {
    const { name, email, password, role = 'student' } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ message: 'Name, email and password are required' });
    }

    if (password.length < 8) {
      return response.status(400).json({ message: 'Password must contain at least 8 characters' });
    }

    if (!['student', 'driver'].includes(role)) {
      return response.status(400).json({ message: 'Public registration only supports student or driver accounts' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return response.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: passwordHash, role });

    return response.status(201).json({ user: publicUser(user), token: createToken(user) });
  } catch (error) {
    return response.status(500).json({ message: 'Unable to create account' });
  }
}

export async function login(request, response) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    const validPassword = user && user.isActive
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!validPassword) {
      return response.status(401).json({ message: 'Invalid email or password' });
    }

    return response.json({ user: publicUser(user), token: createToken(user) });
  } catch (_error) {
    return response.status(500).json({ message: 'Unable to log in' });
  }
}

export function currentUser(request, response) {
  return response.json({ user: publicUser(request.user) });
}
