import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  ########## ENUM & TYPES EXISTANTS ##########
  enum Role {
    ADMIN
    DOCTOR
    MANAGER
    PATIENT
    SUPERADMIN
  }

  type User {
    id: ID
    username: String
    name: String               
    firstName: String          
    lastName: String          
    email: String
    phone: String              
    address: String            
    city: String               
    avatarUrl: String           
    imageUrl: String          
    role: Role
    doctor: User
    patients: [Patient]
    nationalId: String
    condition: String
    permission: String
    createdBy: User
    videos: [Video]
    isDeleted: Boolean         
    lastVisit: Date
    mapsUrl: String
    latitude: Float
    longitude: Float
    isOrtho:  Boolean
    createdAt: Date
    updatedAt: Date
  }


type RevenueStats {
    totalDentists   : Int!
    totalPatients   : Int!
    totalTreatments : Int!
    totalRevenue    : Float!
    monthlyRevenue:   [MonthlyRevenue!]!

  }

  type MonthlyRevenue {
  month: String!        
  revenue: Float!
  prevYearRevenue: Float!
}



type DentistsContactUs {
    id: ID!
    firstName:  String
    lastName:   String
    email:      String
    phone:      String
    address:    String
    city:       String
    date: Date
    message: String
    password:   String
    mapsUrl: String
    latitude: Float
    isOrtho: Boolean
    longitude: Float
    createdAt: Date
    updatedAt: Date
}

  input CreateDentistInput {
    firstName:  String!
    lastName:   String!
    email:      String!
    phone:      String
    address:    String
    city:       String
    password:   String!
    mapsUrl: String
    isOrtho: Boolean
    latitude: Float
    longitude: Float
  }

  input UpdateDentistInput {
    firstName:  String
    lastName:   String
    email:      String
    phone:      String
    address:    String
    city:       String
    password:   String   
    mapsUrl: String 
    latitude: Float
        isOrtho: Boolean
    longitude: Float
  }

  type DeleteDentistPayload {
    success: Boolean!
    message: String!
  }

 
  extend type Query {
    users: [User]
    user(id: ID): User
    profile: User             
    dentists: [User!]!                  
    GetdentistsContactUs: [DentistsContactUs!]!                  
    GetdentistsContactUsById(id: ID!): DentistsContactUs
    dentist(id: ID!): User
    getAllDentists: [User!]!

    getRevenueStats: RevenueStats!

  }

 
  input UpdateProfileInput {
    firstName: String
    lastName: String
    phone: String
    address: String
    city: String
    avatarUrl: String
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }
  input ChangePasswordBOInput {
    id: String!
    newPassword: String!
  }

  
  type OperationResult {
    success: Boolean!
    message: String!
  }

  
  input inputLogin {
    email: String
    password: String
  }


  input inputCreateAdmin {
    email: String
    password: String
    name: String
    username: String
  }



    input newCreateDentistInput {
    firstName:  String
    lastName:   String
    email:      String
    phone:      String
    address:    String
    city:       String
    password:   String
    date: Date
    message: String
    mapsUrl: String
    isOrtho: Boolean
    latitude: Float
    longitude: Float
  }

  extend type Mutation {
    login(input: inputLogin): AuthPayload
    updateProfile(input: UpdateProfileInput): User
    changePassword(input: ChangePasswordInput): OperationResult
    changePasswordBO(input: ChangePasswordBOInput): OperationResult
    deleteAccount: OperationResult
    createDentist(input: CreateDentistInput!): User!
    createAdmin(input: inputCreateAdmin!): User!
    updateDentist(id: ID!, input: UpdateDentistInput!): User!
    deleteDentist(id: ID!): DeleteDentistPayload!
    createNewDentist(input: newCreateDentistInput): DentistsContactUs

  }

  type AuthPayload {
    token: String
    user: User
  }
`;
