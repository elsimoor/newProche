import mongoose from "mongoose";

const HolidaySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const HolidayModel = mongoose.models.Holiday || mongoose.model("Holiday", HolidaySchema);
