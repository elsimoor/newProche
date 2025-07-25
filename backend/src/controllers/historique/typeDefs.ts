import { gql } from "apollo-server-express";

export const HistoriqueTypeDefs = gql`
 enum HistoriqueEvent {
  DOSSIER_PATIENT_CREE
  PHOTOS_AJOUTEES
  SCANNER_AJOUTE
  RADIO_AJOUTEE
  PRESCRIPTION_REALISEE
  PRESCRIPTION_FINALISEE 
  PROPOSITION_TRAITEMENT_SOUMISE
  PROPOSITION_TRAITEMENT_VALIDEE
  ALIGNEURS_EN_COURS_FABRICATION
  ALIGNEURS_PRETS
  ALIGNEURS_LIVRES
  DEMANDE_FINITION_TRAITEMENT
  FINITION_PROPOSEE
  FINITION_VALIDEE
  ALIGNEURS_FINITION_EN_COURS_FABRICATION 
  ALIGNEURS_FINITION_PRETS 
  ALIGNEURS_FINITION_LIVRES 
  CONTENTION_DEMANDEE
  CONTENTION_EN_COURS_FABRICATION
  CONTENTION_PRETE
  CONTENTION_LIVREE
  TRAITEMENT_FINALISE
}

type Historique {
  id: ID!
  patientId: ID
  event: HistoriqueEvent
  timestamp: Date
  details: String
  createdBy: ID 
}

input CreateHistoriqueInput {
  patientId: ID!
  event: HistoriqueEvent
  details: String
}

extend type Query {
  historiquesByPatient(patientId: ID!): [Historique]
  historique(id: ID!): Historique
}

extend type Mutation {
  createHistorique(input: CreateHistoriqueInput): Historique
}

extend type Patient { 
  historique: [Historique]
}

`;
