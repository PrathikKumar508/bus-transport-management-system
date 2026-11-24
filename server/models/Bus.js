import mongoose from 'mongoose';

const busSchema = new mongoose.Schema(
  {
    busNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    capacity: { type: Number, required: true, min: 1, validate: Number.isInteger },
    status: { type: String, enum: ['available', 'active', 'maintenance'], default: 'available' },
  },
  { timestamps: true },
);

export default mongoose.model('Bus', busSchema);
