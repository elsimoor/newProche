import { Schema, model, Types } from "mongoose"

export interface OrderDoc {
  patientId: Types.ObjectId
  dentistId: Types.ObjectId
  alignerNumbers: number[]
  deliveryDate?: Date
  instructions?: string
  express: boolean
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED"
  total: number
  createdAt?: Date
  updatedAt?: Date
  alignersHistory?: {
    number: number
    arcade: "H" | "B"
    statuses: {
      impression: boolean
      thermoformage: boolean
      decoupe: boolean
      packaging: boolean
    }
  }[]
}

const OrderSchema = new Schema<OrderDoc>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
    dentistId: { type: Schema.Types.ObjectId, ref: "User" },
    alignerNumbers: [{ type: Number, min: 1, max: 16 }],
    deliveryDate: Date,
    instructions: String,
    express: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"],
      default: "PENDING"
    },
    total: Number,
    note: String,
    motif: String,
    alignersHistory: [
      {
        number: { type: Number, required: true },
        arcade: {
          type: String,
          enum: ["H", "B"],
          default: "H"
        },
        statuses: {
          impression: { type: Boolean, default: false },
          thermoformage: { type: Boolean, default: false },
          decoupe: { type: Boolean, default: false },
          packaging: { type: Boolean, default: false }
        }
      }
    ]
  },
  { timestamps: true },
)

OrderSchema.index({ dentistId: 1, patientId: 1, createdAt: -1 })

export const OrderModel = model<OrderDoc>("Order", OrderSchema)
