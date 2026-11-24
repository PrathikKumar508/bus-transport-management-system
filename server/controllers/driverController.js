import bcrypt from 'bcryptjs';
import Driver from '../models/Driver.js';
import User from '../models/User.js';

function validateDriverInput(body, { requirePassword = false } = {}) {
  const { name, licenseNumber, phone, email, password, status } = body;
  if (!name || !licenseNumber || !phone || !email || (requirePassword && !password)) return 'Name, license number, phone and email are required';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address';
  if (password && password.length < 8) return 'Password must contain at least 8 characters';
  if (status && !['available', 'assigned', 'inactive'].includes(status)) return 'Invalid driver status';
  return null;
}

export async function listDrivers(_request, response) {
  const drivers = await Driver.find().sort({ name: 1 });
  return response.json({ drivers });
}

export async function getDriver(request, response) {
  const driver = await Driver.findById(request.params.id);
  if (!driver) return response.status(404).json({ message: 'Driver not found' });
  return response.json({ driver });
}

export async function createDriver(request, response) {
  const validationError = validateDriverInput(request.body, { requirePassword: true });
  if (validationError) return response.status(400).json({ message: validationError });

  try {
    const { name, licenseNumber, phone, email, password, status } = request.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return response.status(409).json({ message: 'An account with this email already exists' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: 'driver' });
    try {
      const driver = await Driver.create({ userId: user._id, name, licenseNumber, phone, email, status });
      return response.status(201).json({ driver });
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      if (error.code === 11000) return response.status(409).json({ message: 'License number already exists' });
      return response.status(500).json({ message: 'Unable to create driver profile' });
    }
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ message: 'License number already exists' });
    return response.status(500).json({ message: 'Unable to create driver' });
  }
}

export async function updateDriver(request, response) {
  const validationError = validateDriverInput(request.body);
  if (validationError) return response.status(400).json({ message: validationError });

  try {
    const { password, ...profile } = request.body;
    const driver = await Driver.findByIdAndUpdate(request.params.id, profile, { new: true, runValidators: true });
    if (!driver) return response.status(404).json({ message: 'Driver not found' });
    if (password) await User.findByIdAndUpdate(driver.userId, { password: await bcrypt.hash(password, 12) });
    return response.json({ driver });
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ message: 'License number already exists' });
    return response.status(500).json({ message: 'Unable to update driver' });
  }
}

export async function deleteDriver(request, response) {
  const driver = await Driver.findByIdAndDelete(request.params.id);
  if (!driver) return response.status(404).json({ message: 'Driver not found' });
  if (driver.userId) await User.findByIdAndDelete(driver.userId);
  return response.json({ message: 'Driver deleted successfully' });
}
