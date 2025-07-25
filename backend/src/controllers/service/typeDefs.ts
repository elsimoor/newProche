// service.schema.ts
import { gql } from 'apollo-server-express';

export const serviceTypeDef = gql`

  type Service {
    id: ID!
    businessId: ID!
    businessType: String!
    name: String!
    description: String
    category: String
    duration: Int
    price: Float!
    available: Boolean!
    popular: Boolean!
    staffRequired: [String!]!
    requirements: [String!]!
    images: [String!]!
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }
`;
