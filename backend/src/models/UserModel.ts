import { Schema, model } from "mongoose";

interface User {
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  avatarUrl?: string;
  imageUrl?: string;
  role: 'ADMIN' | 'DOCTOR' | 'MANAGER' | 'PATIENT' | 'SUPERADMIN';
  twoFactorSecret?: string;
  createdAt?: Date;
  updatedAt?: Date;
  nationalId: string;
  condition?: string;
  lastVisit?: Date;
  permission?: string;
  createdBy?: string;
  doctor?: string;
  patients?: string[];
  videos?: string[];
  isDeleted?: boolean;
  mapsUrl?: string;
  latitude: string
  longitude: string
  isOrtho?: boolean;
}

const UserSchema = new Schema<User>(
  {
    name: { type: String },
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, enum: ['ADMIN', 'DOCTOR', 'MANAGER', 'PATIENT', 'SUPERADMIN'] },
    doctor: { type: Schema.Types.ObjectId, ref: "User" },
    patients: [{ type: Schema.Types.ObjectId, ref: "Patient" }],
    twoFactorSecret: { type: String },
    nationalId: { type: String, unique: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    permission: { type: String },
    condition: { type: String },
    lastVisit: { type: Date },
    imageUrl: { type: String },
    videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],

    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    avatarUrl: { type: String },
    isDeleted: { type: Boolean, default: false },
    mapsUrl: { type: String },
    latitude: { type: Number },   // Changed to Number for float values
    longitude: { type: Number },  // Changed to Number for float values
    isOrtho: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const UserModel = model<User>("User", UserSchema);
