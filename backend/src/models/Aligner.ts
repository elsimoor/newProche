import { Schema, model, Types } from "mongoose"

export interface AlignerDoc {
  dentistId: Types.ObjectId
  number: number               
  label?: string               
  price: number               
  stock: number              
  createdAt?: Date
  updatedAt?: Date
}

const AlignerSchema = new Schema<AlignerDoc>(
  {
    dentistId : { type: Schema.Types.ObjectId, ref: "User", required: true },
    number    : { type: Number, min: 1,required: true },
    label     : String,
    price     : { type: Number, default: 322.5 },
    stock     : { type: Number, default: 1 },
  },
  { timestamps: true },
)

AlignerSchema.index({ dentistId:1, number:1 }, { unique:true })

export const AlignerModel = model<AlignerDoc>("Aligner", AlignerSchema)
