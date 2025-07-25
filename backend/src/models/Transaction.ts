import { Schema, model, Types } from "mongoose"

export interface TransactionDoc {
  patientId: Types.ObjectId
  dentistId: Types.ObjectId
  type: "INVOICE" | "PAYMENT"
  description: string
  amount: number            
  createdAt?: Date
}

const TransactionSchema = new Schema<TransactionDoc>(
  {
    patientId : { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    dentistId : { type: Schema.Types.ObjectId, ref: "User",    required: true },
    type      : { type: String, enum: ["INVOICE","PAYMENT"], required: true },
    description: String,
    amount    : Number,
  },
  { timestamps: true }
)

TransactionSchema.index({ patientId:1, createdAt:-1 })

export const TransactionModel = model<TransactionDoc>("Transaction", TransactionSchema)
