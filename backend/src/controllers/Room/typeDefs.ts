// room.schema.ts
import { gql } from 'apollo-server-express';

export const roomTypeDef = gql`

  type Room {
    id: ID!
    hotelId: ID!
    number: String!
    type: String!
    floor: Int
    capacity: Int!
    price: Float!
    size: Int
    status: String!
    amenities: [String!]!
    features: [String!]!
    condition: String!
    lastCleaned: Date
    nextMaintenance: Date
    images: [String!]!
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }
`;
