import mongoose, { Schema, Document } from "mongoose";

export interface IDeliveryTime extends Document {
  fromCity: string;
  toCity: string;
  days: number;
}

const deliveryTimeSchema = new Schema<IDeliveryTime>(
  {
    fromCity: { type: String, trim: true },
    toCity:   { type: String, trim: true },
    days:     { type: Number, min: 1 },
  },
  { timestamps: true },
);

// 1 pair of cities = 1 record
deliveryTimeSchema.index({ fromCity: 1, toCity: 1 }, { unique: true });

export const DeliveryTimeModel =
  mongoose.models.DeliveryTime ||
  mongoose.model<IDeliveryTime>("DeliveryTime", deliveryTimeSchema);
