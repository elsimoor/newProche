import { gql } from "apollo-server-express";

export const patientTypeDefs = gql`


enum YesNo { yes no }

  type BOAlignerStock {
    dentist: User!
    number : Int!     
    price  : Float
    stock  : Int
  }

  type BODashboardStats {
    totalPatients         : Int!
    patientsPending       : Int!
    totalDentists         : Int!
    totalAlignersInStock  : Int!
  }

   enum OrderStatus {
    PENDING
    CONFIRMED
    SHIPPED
    DELIVERED
    CANCELED
  }




 input AlignerStatusesInput {
  impression: Boolean
  thermoformage: Boolean
  decoupe: Boolean
  packaging: Boolean
}

enum arcade {
  H
  B
}

input AlignerHistoryInput {
  number: Int!
  arcade: arcade
  statuses: AlignerStatusesInput!
}

input UpdateOrderStatusInput {
  id: ID
  status: OrderStatus
  arcade: arcade
  alignersHistory: [AlignerHistoryInput]
}

  input inputMarkAsCanceled {
    id: ID
    note: String
    motif: String
  }



input DeleteOrderInput {
  id: ID
}

input ResetOrderInput {
  id: ID
}


enum Jaw {
    upper
    lower
  }

  type IprPair {
    teeth: [Int!]!   
    amount: Float!
    jaw: Jaw!
  }

  type PhaseEvent {
  label: String
  date : Date
}


type AlignerHistoryEvent {
  label: String
  date : Date
}

  type TreatmentPhase {
    step: Int!      
    stock: Int
    price: Float                
    label: String
    description: String
    fixedTeeth: [Int]
    iprTeeth: [Int]
    actionTeeth: [Int]
    iprPairs: [IprPair]
    events: [PhaseEvent]  
    taquetTeeth : [Int]
    attachmentTeeth: [Int]  # New field for attachment teeth
    
    createdAt: Date
    updatedAt: Date
  }

  input IprPairInput {
    teeth: [Int!]!  
    amount: Float!
    jaw: Jaw!
  }

  input TreatmentPhaseInput {
    step: Int!
    stock: Int
    price: Float
    label: String
    description: String
    fixedTeeth: [Int]
    iprTeeth: [Int]
    taquetTeeth : [Int]     
    actionTeeth: [Int]
    iprPairs: [IprPairInput]
    attachmentTeeth: [Int]
    missingTeeth: [Int]

  }

  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  type ImageGroup {
    profile: String
    front: String
    smile: String
    upper: String
    lower: String
    face: String
    open: String
    side: String
    left: String
  }

  type Patient {
    id: ID
    type: String
    nom: String
    status: String
    dentistId: User
    firstName: String
    name: String
    lastName: String
    prenom: String
    email: String
    telephone: String
    dateNaissance: Date
    genre: Gender
    notes: String
    isInternational: Boolean
    indications: [String]
    photos: [String]
    radioUrls: [String]
    imagesByType: ImageGroup
    cloudImagesByType: ImageGroup
    computerImagesByType: ImageGroup
    creationFormule: Boolean
    treatmentObjective: String
    selectedArch: String
    jointPieces: String
    placementTime: String
    fixedTeeth: [Int]
    attachmentTeeth: [Int]
    step2Notes: String
    scanStlUrls: [String]         
    isBoVerifyIt: Boolean
    requireOpenChatBO: Boolean
    doneOpenChatDentist: Boolean
    isDentistShowMsg: Boolean
    treatmentPhases: [TreatmentPhase]
    currentAligner: Int
    audioInstructions: [String]
    missingTeeth: [Int]
    setup3d: [String]
    nimoTeck3dLink: String
    isvalideYS: Boolean
    isValideDentist: Boolean
    joEcouleStart: Date
    joEcouleEnd: Date
    aligersTotalPrice: String
    isVlideSetupComplet: Boolean
    isAligersDemand: Boolean

    dateOfRegistration: Date
    patientName: String
    doctorName: String
    doctorEmail: String
    idNemoStudio: String
    recordsForPlanning: String

    expansionPreference: String
    expansionAmount: Float
    upperMidlineMatchesLower: YesNo
    upperMidlineAction: String
    lowerMidlineAction: String
    iprAllowance: String

    correctAnteriorCrossbite: String
    correctPosteriorCrossbite: String
    teethExtractionPrior: YesNo

    spacesAction: String
    rehabilitationTiming: String

    overbiteAction: String
    openbiteAction: String

    acceptBiteRisers: YesNo
    classIIOrIIICorrection: [String]
    molarCanineCorrection: String
    isArchived: Boolean

    profileComplaints: YesNo
    agreeThirdMolarExtraction: YesNo
    rootSegmentation: YesNo

    indicationsForPlanning: String

    isSetupPaid:Boolean
    isAlignersPaid:Boolean
    isAlignersShipped:Boolean
    TretmentFinalise:Boolean
    createdAt: Date
    updatedAt: Date
  }


   type Order {
   id: ID
   patientId: Patient
   dentistId: User
   alignerNumbers: [Int]
   alignersHistory: [AlignerHistory]
   deliveryDate: Date
   instructions: String
   express: Boolean
   status: String
   total: Float
   note: String
   motif: String
   createdAt: Date
   updatedAt: Date
 }

  input ImageGroupInput {
    profile: String
    front: String
    smile: String
    upper: String
    lower: String
    face: String
    open: String
    side: String
    left: String
  }


  input PatientInput {
    type: String
    nom: String
    prenom: String
    email: String
    isValideDentist: Boolean
    isvalideYS: Boolean
    telephone: String
    dateNaissance: Date
    genre: Gender
    notes: String
    isInternational: Boolean
    requireOpenChatBO: Boolean
    doneOpenChatDentist: Boolean
    indications: [String]
    photos: [String]
    status: String
    creationFormule: Boolean
    imagesByType: ImageGroupInput
    cloudImagesByType: ImageGroupInput
    computerImagesByType: ImageGroupInput
    treatmentObjective: String
    selectedArch: String
    jointPieces: String
    placementTime: String
    fixedTeeth: [Int]
    attachmentTeeth: [Int]
    step2Notes: String
    scanStlUrls: [String]       
    isBoVerifyIt: Boolean
    audioInstructions: [String]
    missingTeeth: [Int]
    radioUrls: [String]
    nimoTeck3dLink: String
    joEcouleStart: Date
    joEcouleEnd: Date
    
    dateOfRegistration: Date
  patientName: String
  doctorName: String
  doctorEmail: String
  idNemoStudio: String
  recordsForPlanning: String

  expansionPreference: String      # or ExpansionPreferenceEnum
  expansionAmount: Float
  upperMidlineMatchesLower: YesNo  # or String
  upperMidlineAction: String
  lowerMidlineAction: String
  iprAllowance: String

  correctAnteriorCrossbite: String
  correctPosteriorCrossbite: String
  teethExtractionPrior: YesNo

  spacesAction: String
  rehabilitationTiming: String

  overbiteAction: String
  openbiteAction: String

  acceptBiteRisers: YesNo
  classIIOrIIICorrection: [String]     # checkbox → list
  molarCanineCorrection: String
  setup3d: [String]
  profileComplaints: YesNo
  agreeThirdMolarExtraction: YesNo
  rootSegmentation: YesNo

  indicationsForPlanning: String
    }


  input PatientInputForMobile {
      
    audioInstructions: [String]
  }


   type Aligner {
   id:ID
   dentistId:User
   number:Int
   label:String
   price:Float
   stock:Int
   createdAt:Date
   updatedAt:Date
 }

 type AlignerStatuses {
  impression: Boolean!
  thermoformage: Boolean!
  decoupe: Boolean!
  packaging: Boolean!
}

type AlignerHistory {
  number: Int!
  arcade: arcade
  statuses: AlignerStatuses!
}


 input AlignerInput {
   number:Int!
   label:String
   price:Float
   stock:Int
 }


 type ToothStat { number: Int! status: Int! }     # 0–4
type TeethStatus { upper:[ToothStat!]! lower:[ToothStat!]! }

type ToothMovement { tooth:Int! start:Int! end:Int! }

type PatientAdvance {
  patientName:     String!
  currentAligner:  Int!
  activeAligners:  [Int!]!
  teeth:           TeethStatus!
  movements:       [ToothMovement!]!
}
  
  extend type Query {
    patients: [Patient]
    patient(id: ID!): Patient
    patientsByDentistId: [Patient]
    boPatientsPending: [Patient]     
    boPatient(id: ID!): Patient   
    dentistsWithPatients: [User!]!
    patientOrders(patientId:ID!, statuses:[String]):[Order!]!
    alignersByDentist(dentistId:ID!):[Aligner]
    aligner(id:ID!):Aligner
    aligners:[PatientAligner]
    patientTransactions(patientId:ID!):[Transaction]
    dentistStats(dentistId:ID!):Stats
    patientAdvance(id:ID!): PatientAdvance!
    patientAlignerHistory(patientId: ID!): [AlignerHistoryEvent]
    boAlignerStock: [BOAlignerStock!]!
    boAlignerStockByDentist(dentistId: ID!): [BOAlignerStock!]!
    boDashboardStats: BODashboardStats!
    getAllOrders(statuses: [OrderStatus]): [Order]
    getPatientSetup3d(patientId: ID!): Patient
    

    

  }


  type Stats {
    totalInvoices:Float!
    totalPayments:Float!
    balance:Float!
  }

  input PatientAlignerInput {
    number:Int
    price:Float
    paid:Float
  }


  type PatientAligner {
    number:Int
    price:Float
    paid:Float
    balance:Float
  }


  type Transaction {
    id:ID!
    patientId:Patient!
    dentistId:User!
    type:String!
    description:String
    amount:Float!
    createdAt:Date
  }



  input UpdatePatientSetup3dInput {
    patientId: ID!
    setup3d: [String]
    nimoTeck3dLink: String
  }



  input inputUpdatePatientStatusisvalideYS {
    patientId: ID!
      isvalideYS: Boolean
  } 



 input inputUpdatePatientStatusisValideDentist {
      patientId: ID!
      isValideDentist: Boolean
  } 

  extend type Mutation {
    createPatient(input: PatientInput): Patient
    UpdatePatient(id: ID!, input: PatientInput!): Patient
    UpdatePatientForMobile(id: ID!, input: PatientInputForMobile): Patient
    deletePatient(id: ID!): Boolean
    boUpsertTreatmentPhases(
      patientId: ID!
      phases: [TreatmentPhaseInput!]!
    ): Patient

    boToggleValidation(patientId: ID!, validated: Boolean!): Patient
    boToggleValidationAligners(patientId: ID!, validated: Boolean!): Patient

    # -------- Dentiste --------
    updateDentistProgress(patientId: ID!, aligner: Int!): Patient
    orderNextAligners(
      patientId:ID!
      alignerNumbers:[Int!]!
      deliveryDate:Date
      instructions:String
      express:Boolean
    ):Order

    createAligner(dentistId:ID!, input:AlignerInput!):Aligner      
    updateAligner(id:ID!, input:AlignerInput!):Aligner           
    deleteAligner(id:ID!):Boolean             
    updatePatientAligners(patientId:ID!, aligners:[Int]):Patient   

    setPatientAligners(patientId:ID!, aligners:[PatientAlignerInput]):Patient
    addTransaction(
      patientId:ID
      type:String
      description:String
      amount:Float
    ):Transaction


    updateOrderStatus(input: UpdateOrderStatusInput): Order
    updateOrderStatusOfAligner(input: UpdateOrderStatusInput): Order
    markAsCanceled(input: inputMarkAsCanceled): Order
    
    deleteOrder(input: DeleteOrderInput): Boolean
    resetOrderStatuses(input: ResetOrderInput): Order
    updatePatientSetup3d(input: UpdatePatientSetup3dInput): Patient
    deleteImageFromPatient(patientId: ID!, imageType: String!, imageUrl: String!): Patient





    updatePatientStatusisvalideYS(
      input: inputUpdatePatientStatusisvalideYS
    ): Patient

      updatePatientStatusisValideDentist(
      input: inputUpdatePatientStatusisValideDentist
    ): Patient


    # aligersTotalPrice
    addAlignersTotalPrice(
      patientId: ID!
      aligersTotalPrice: String!
    ): Patient


    # isVlideSetupComplet
    updateIsVlideSetupComplet(
      patientId: ID!
      isVlideSetupComplet: Boolean!
    ): Patient


    # isArchived
    isPatientArchived(
      patientId: ID!
      isArchived: Boolean!
    ): Patient


    # isAlignersPaid 
    isAlignersPaidByDentist(
      patientId: ID!
      isAlignersPaid: Boolean!
    ): Patient

    # isSetupPaid

    isSetupPaidByDentist(
      patientId: ID!
      isSetupPaid: Boolean!
    ): Patient
  



    # isDentistShowMsgForApatient
     isDentistShowMsgForApatient(
      patientId: ID!
      isDentistShowMsg: Boolean!
    ): Patient


     isTretmentFinaliseByBo(
      patientId: ID!
      TretmentFinalise: Boolean!
    ): Patient



      deleteAudioInstruction(id: ID!, url: String!): Patient!

     
  }
`;
