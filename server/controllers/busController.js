import Bus from '../models/Bus.js';

function validateBusInput(body) {
  const { busNumber, registrationNumber, capacity, status } = body;
  if (!busNumber || !registrationNumber || capacity === undefined) {
    return 'Bus number, registration number and capacity are required';
  }
  if (!Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
    return 'Capacity must be a positive whole number';
  }
  if (status && !['available', 'active', 'maintenance'].includes(status)) {
    return 'Invalid bus status';
  }
  return null;
}

export async function listBuses(_request, response) {
  const buses = await Bus.find().sort({ busNumber: 1 });
  return response.json({ buses });
}

export async function getBus(request, response) {
  const bus = await Bus.findById(request.params.id);
  if (!bus) return response.status(404).json({ message: 'Bus not found' });
  return response.json({ bus });
}

export async function createBus(request, response) {
  const validationError = validateBusInput(request.body);
  if (validationError) return response.status(400).json({ message: validationError });

  try {
    const bus = await Bus.create({ ...request.body, capacity: Number(request.body.capacity) });
    return response.status(201).json({ bus });
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ message: 'Bus number or registration number already exists' });
    return response.status(500).json({ message: 'Unable to create bus' });
  }
}

export async function updateBus(request, response) {
  const validationError = validateBusInput(request.body);
  if (validationError) return response.status(400).json({ message: validationError });

  try {
    const bus = await Bus.findByIdAndUpdate(
      request.params.id,
      { ...request.body, capacity: Number(request.body.capacity) },
      { new: true, runValidators: true },
    );
    if (!bus) return response.status(404).json({ message: 'Bus not found' });
    return response.json({ bus });
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ message: 'Bus number or registration number already exists' });
    return response.status(500).json({ message: 'Unable to update bus' });
  }
}

export async function deleteBus(request, response) {
  const bus = await Bus.findByIdAndDelete(request.params.id);
  if (!bus) return response.status(404).json({ message: 'Bus not found' });
  return response.json({ message: 'Bus deleted successfully' });
}
