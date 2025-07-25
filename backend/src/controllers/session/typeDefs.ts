import { gql } from "apollo-server-express";

export const SessionTypeDefs = gql`



type SessionImage {
  url       : String
  imageType : String
  createdAt : Date
}

type Session {
  id         : ID
  sessionId  : String
  patientId  : String
  imageType  : String
  dentistUid : String
  otp        : String       
  images     : ImageGroup
  expiresAt  : Date
  createdAt  : Date
}

input CreateSessionInput {
  sessionId  : String
  patientId  : String
  imageType  : String
  dentistUid : String
  otp        : String
  expiresAt  : Date
}

input VerifyOtpInput {
  sessionId  : String
  otp        : String
  patientId  : String
  dentistUid : String
}

input AddSessionImageInput {    
  sessionId  : String
  images     : ImageGroupInput
}


extend type Mutation {
  createSession(input: CreateSessionInput): Session
  verifyOtp(input: VerifyOtpInput): Boolean
    addSessionImage(input: AddSessionImageInput): SessionImage   # NEW

}

`;
