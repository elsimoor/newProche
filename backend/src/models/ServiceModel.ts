import mongoose, { Document, Schema } from 'mongoose';

interface IService extends Document {
  businessId: mongoose.Types.ObjectId;
  businessType: 'hotel' | 'restaurant' | 'salon';
  name: string;
  description?: string;
  category?: string;
  duration?: number; // in minutes
  price: number;
  available?: boolean;
  popular?: boolean;
  staffRequired: string[];
  requirements: string[];
  images: string[];
  isActive?: boolean;
}

const serviceSchema = new Schema<IService>({
  businessId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  businessType: {
    type: String,
    enum: ['hotel', 'restaurant', 'salon'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  duration: Number, // in minutes
  price: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  staffRequired: [String],
  requirements: [String],
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IService>('Service', serviceSchema);