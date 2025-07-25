// models/Video.ts
import { Schema, model } from 'mongoose';

interface Video {
  title: string;
  duration: number;
  image?: string;
  youtubeId: string;
  dentistId: string;     
  createdAt?: Date;
  updatedAt?: Date;
}

const VideoSchema = new Schema<Video>(
  {
    title: String,
    duration: Number,
    image: String,
    youtubeId: String,
    dentistId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const VideoModel = model<Video>('Video', VideoSchema);
