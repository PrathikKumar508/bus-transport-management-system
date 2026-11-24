import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import User from '../models/User.js';

const name = process.env.ADMIN_NAME;
const email = process.env.ADMIN_EMAIL?.toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!name || !email || !password) {
  console.error('Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first.');
  process.exit(1);
}

if (password.length < 8) {
  console.error('ADMIN_PASSWORD must contain at least 8 characters.');
  process.exit(1);
}

try {
  await connectDatabase();
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await User.findOneAndUpdate(
    { email },
    { name, email, password: passwordHash, role: 'admin', isActive: true },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
  );
  console.log(`Admin account ready: ${admin.email}`);
} catch (error) {
  console.error('Unable to create Admin account:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
