import mongoose, { Schema, Document } from 'mongoose';

interface HotelDocument extends Document {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  settings: {
    checkInTime: string;
    checkOutTime: string;
    currency: string;
    timezone: string;
    taxRate: number;
    serviceFee: number;
  };
  amenities: {
    name: string;
    description: string;
    included: boolean;
    category: string;
  }[];
  services: {
    name: string;
    description: string;
    price: number;
    category: string;
    available: boolean;
  }[];
  policies: {
    title: string;
    description: string;
    category: string;
  }[];
  images: string[];
  rating: {
    average: number;
    count: number;
  };
  isActive: boolean;
}

const hotelSchema = new Schema<HotelDocument>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  settings: {
    checkInTime: { type: String, default: '15:00' },
    checkOutTime: { type: String, default: '11:00' },
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    taxRate: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 }
  },
  amenities: [{
    name: String,
    description: String,
    included: { type: Boolean, default: true },
    category: String
  }],
  services: [{
    name: String,
    description: String,
    price: Number,
    category: String,
    available: { type: Boolean, default: true }
  }],
  policies: [{
    title: String,
    description: String,
    category: String
  }],
  images: [String],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<HotelDocument>('Hotel', hotelSchema);