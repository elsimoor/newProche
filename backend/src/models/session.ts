// src/models/session.ts
import { Schema, model, Document } from 'mongoose';

const ImageGroupSchema = new Schema(
    {
        profile: String,
        front: String,
        smile: String,
        upper: String,
        lower: String,
        face: String,
        open: String,
        side: String,
    },
    { _id: false }
);


export interface SessionDoc extends Document {
    sessionId: string;
    patientId: string;
    imageType?: string;
    dentistUid?: string;
    otp: string;
    expiresAt: Date;
    createdAt: Date;
    images?: (typeof ImageGroupSchema)[];
}



const sessionSchema = new Schema<SessionDoc>({
    sessionId: { type: String, unique: true, index: true },
    patientId: { type: String, required: true },
    imageType: { type: String },
    dentistUid: { type: String },
    otp: { type: String },
    expiresAt: { type: Date, index: { expires: 0 } }, // TTL
    createdAt: { type: Date, default: Date.now },
    images: ImageGroupSchema



});

export const SessionModel = model<SessionDoc>('Session', sessionSchema);
