import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
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
    const { name, email, password, role = 'student', studentId, department, year, phone } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ message: 'Name, email and password are required' });
    }

    if (password.length < 8) {
      return response.status(400).json({ message: 'Password must contain at least 8 characters' });
    }

    if (!['student', 'driver'].includes(role)) {
      return response.status(400).json({ message: 'Public registration only supports student accounts' });
    }

    if (role !== 'student') {
      return response.status(403).json({ message: 'Driver accounts must be created by an Admin' });
    }

    if (!studentId || !department || !year) {
      return response.status(400).json({ message: 'Student ID, department and year are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return response.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: passwordHash, role });

    try {
      await Student.create({ userId: user._id, studentId, name, department, year, phone });
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      if (error.code === 11000) return response.status(409).json({ message: 'Student ID already exists' });
      return response.status(500).json({ message: 'Unable to create student profile' });
    }

    return response.status(201).json({ user: publicUser(user), token: createToken(user) });
  } catch (error) {
    return response.status(500).json({ message: 'Unable to create account' });
  }
}

export async function login(request, response) {
  try {
    const { email, password, role } = request.body;

    if (!email || !password || !role) {
      return response.status(400).json({ message: 'Email, password and role are required' });
    }

    if (!['admin', 'student', 'driver'].includes(role)) {
      return response.status(400).json({ message: 'Invalid login role' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    const validPassword = user && user.isActive
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!validPassword) {
      return response.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role !== role) {
      return response.status(403).json({ message: `This account is not registered as a ${role}` });
    }

    return response.json({ user: publicUser(user), token: createToken(user) });
  } catch (_error) {
    return response.status(500).json({ message: 'Unable to log in' });
  }
}

export function currentUser(request, response) {
  return response.json({ user: publicUser(request.user) });
}
