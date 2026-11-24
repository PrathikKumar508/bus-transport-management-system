import Driver from '../models/Driver.js';

function validateDriverInput(body) {
  const { name, licenseNumber, phone, email, status } = body;
  if (!name || !licenseNumber || !phone || !email) return 'Name, license number, phone and email are required';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address';
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
  const validationError = validateDriverInput(request.body);
  if (validationError) return response.status(400).json({ message: validationError });

  try {
    const driver = await Driver.create(request.body);
    return response.status(201).json({ driver });
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ message: 'License number already exists' });
    return response.status(500).json({ message: 'Unable to create driver' });
  }
}

export async function updateDriver(request, response) {
  const validationError = validateDriverInput(request.body);
  if (validationError) return response.status(400).json({ message: validationError });

  try {
    const driver = await Driver.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    if (!driver) return response.status(404).json({ message: 'Driver not found' });
    return response.json({ driver });
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ message: 'License number already exists' });
    return response.status(500).json({ message: 'Unable to update driver' });
  }
}

export async function deleteDriver(request, response) {
  const driver = await Driver.findByIdAndDelete(request.params.id);
  if (!driver) return response.status(404).json({ message: 'Driver not found' });
  return response.json({ message: 'Driver deleted successfully' });
}
