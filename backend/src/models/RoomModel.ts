import mongoose, { Schema, Document } from 'mongoose';

interface RoomDocument extends Document {
  hotelId: mongoose.Types.ObjectId;
  number: string;
  type: 'Standard' | 'Deluxe' | 'Suite' | 'Executive';
  floor: number;
  capacity: number;
  price: number;
  size: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  amenities: string[];
  features: string[];
  condition: 'excellent' | 'good' | 'needs_repair';
  lastCleaned: Date;
  nextMaintenance: Date;
  images: string[];
  isActive: boolean;
}

const roomSchema = new Schema<RoomDocument>({
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  number: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Standard', 'Deluxe', 'Suite', 'Executive']
  },
  floor: Number,
  capacity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  size: Number,
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'cleaning'],
    default: 'available'
  },
  amenities: [String],
  features: [String],
  condition: {
    type: String,
    enum: ['excellent', 'good', 'needs_repair'],
    default: 'excellent'
  },
  lastCleaned: Date,
  nextMaintenance: Date,
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

roomSchema.index({ hotelId: 1, number: 1 }, { unique: true });

export default mongoose.model<RoomDocument>('Room', roomSchema);