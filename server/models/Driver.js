import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    licenseNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: ['available', 'assigned', 'inactive'], default: 'available' },
  },
  { timestamps: true },
);

export default mongoose.model('Driver', driverSchema);
