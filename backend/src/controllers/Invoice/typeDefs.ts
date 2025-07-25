import { gql } from "apollo-server-express";

export const invoiceTypeDefs = gql`
  enum InvoiceStatus {
    Paye
    A_regler
    En_cours
    Regle
    A_venir
    En_attente_assignation
  }

  enum InvoiceType {
    Setup
    Aligneurs
    Accessoires
    Custom
  }

  type Invoice {
    id: ID!
    patientID: Patient
    PatientID: Patient
    dentistID: User
    amount: Float
    object: String
    aligners: [Int]
    status: InvoiceStatus
    type: InvoiceType
    body:          String
    isCustom:      Boolean
    createdAt: String
    updatedAt: String
  }

  input CreateInvoiceInput {
    patientID: ID!
    amount: Float!
    object: String
    aligners: [Int!]
    status: InvoiceStatus
    type: InvoiceType!
  }

  input UpdateInvoiceInput {
    id: ID!
    amount: Float
    object: String
    aligners: [Int!]
    status: InvoiceStatus
    type: InvoiceType
  }

  input CustomInvoiceInput {
  dentistId: ID               # optional – may be assigned later
  patientId: ID
  object:    String
  body:      String
  amount:    Float
}

  extend type Query {
    getInvoices: [Invoice]
    getInvoiceByPatientID(patientId: ID!): [Invoice!]!
    getInvoiceById(id: ID!): Invoice
  }


  extend type Mutation {
    createCustomInvoice(input: CustomInvoiceInput): Invoice!
    assignInvoiceToDentist(invoiceId: ID, dentistId: ID): Invoice
    createInvoice(input: CreateInvoiceInput!): Invoice!
    updateInvoice(input: UpdateInvoiceInput!): Invoice!
    deleteInvoice(id: ID!): Boolean!
  }
`;
