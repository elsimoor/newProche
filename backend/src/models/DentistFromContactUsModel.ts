import { Schema, model } from "mongoose";

interface DentistFromContactUs {
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
}

const DentistFromContactUsSchema = new Schema<DentistFromContactUs>(
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
    date: { type: Date }, // New field for date
    message: { type: String } // New field for message
  },
  { timestamps: true }
);

export const DentistFromContactUsModel = model<DentistFromContactUs>("DentistFromContactUs", DentistFromContactUsSchema);
