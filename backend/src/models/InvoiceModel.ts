import mongoose, { Schema, Document } from "mongoose";

export interface IInvoice extends Document {
  PatientID: mongoose.Types.ObjectId;
  DentistID: mongoose.Types.ObjectId;
  amount: number;
  object: string;
  aligners: number[];
  body?: string;                       // ⬅︎ descriptive text printed on PDF
  isCustom: boolean;
  status: "Payé" | "A_regler" | "En_cours" | "Regle" | "A_venir" | string;
  type: "Setup" | "Aligneurs" | "Accessoires" | "Custom";

  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema(
  {
    patientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      // required: true,
    },
    DentistID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    object: {
      type: String,
      // required: true,
    },
    aligners: {
      type: [Number],
      // required: false,
    },
    body: { type: String, default: "" },
    isCustom: { type: Boolean, default: false },
    amount: {
      type: Number,
      // required: true,
    },
    status: {
      type: String,
      enum: ["Paye", "A_regler", "En_cours", "Regle", "A_venir", "En_attente_assignation"],
      default: "En_attente_assignation",
    },
    type: {
      type: String,
      enum: ["Setup", "Aligneurs", "Accessoires", "Custom"],
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInvoice>("Invoice", InvoiceSchema);
