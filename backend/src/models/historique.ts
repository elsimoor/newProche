import mongoose, { Document, Schema } from 'mongoose';

// Enum for Historique events
export enum HistoriqueEvent {
  DOSSIER_PATIENT_CREE                   = "DOSSIER_PATIENT_CREE",
  PHOTOS_AJOUTEES                        = "PHOTOS_AJOUTEES",
  SCANNER_AJOUTE                         = "SCANNER_AJOUTE",
  RADIO_AJOUTEE                          = "RADIO_AJOUTEE",
  PRESCRIPTION_REALISEE                  = "PRESCRIPTION_REALISEE",
  PRESCRIPTION_FINALISEE                 = "PRESCRIPTION_FINALISEE",
  PROPOSITION_TRAITEMENT_SOUMISE         = "PROPOSITION_TRAITEMENT_SOUMISE",
  PROPOSITION_TRAITEMENT_VALIDEE         = "PROPOSITION_TRAITEMENT_VALIDEE",
  ALIGNEURS_EN_COURS_FABRICATION         = "ALIGNEURS_EN_COURS_FABRICATION",
  ALIGNEURS_PRETS                        = "ALIGNEURS_PRETS",
  ALIGNEURS_LIVRES                       = "ALIGNEURS_LIVRES",
  DEMANDE_FINITION_TRAITEMENT            = "DEMANDE_FINITION_TRAITEMENT",
  FINITION_PROPOSEE                      = "FINITION_PROPOSEE",
  FINITION_VALIDEE                       = "FINITION_VALIDEE",
  ALIGNEURS_FINITION_EN_COURS_FABRICATION = "ALIGNEURS_FINITION_EN_COURS_FABRICATION",
  ALIGNEURS_FINITION_PRETS               = "ALIGNEURS_FINITION_PRETS",
  ALIGNEURS_FINITION_LIVRES              = "ALIGNEURS_FINITION_LIVRES",
  CONTENTION_DEMANDEE                    = "CONTENTION_DEMANDEE",
  CONTENTION_EN_COURS_FABRICATION        = "CONTENTION_EN_COURS_FABRICATION",
  CONTENTION_PRETE                       = "CONTENTION_PRETE",
  CONTENTION_LIVREE                      = "CONTENTION_LIVREE",
  TRAITEMENT_FINALISE                    = "TRAITEMENT_FINALISE"
}


export interface IHistorique extends Document {
  patientId: Schema.Types.ObjectId; // Assuming you have a Patient model
  event: HistoriqueEvent;
  timestamp: Date;
  details?: string;
  createdBy?: Schema.Types.ObjectId; // Optional: To track who initiated the event (e.g., user ID)
}

const HistoriqueSchema: Schema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient', // Replace 'Patient' with your actual Patient model name if different
  },
  event: {
    type: String,
    enum: Object.values(HistoriqueEvent),
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
  },
  createdBy: { // Optional: if you want to log which user/actor created the event
    type: Schema.Types.ObjectId,
    ref: 'User', // Replace 'User' with your actual User model name if different
  },
});

// Indexing for better query performance on patientId
HistoriqueSchema.index({ patientId: 1, timestamp: -1 });

export const HistoriqueModel = mongoose.models.Historique || mongoose.model<IHistorique>('Historique', HistoriqueSchema);

