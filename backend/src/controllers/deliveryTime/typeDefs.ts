import { gql } from "apollo-server-express";

export const deliveryTimeTypeDefs = gql`
 
  type DeliveryTime {
    id: ID!
    fromCity: String!
    toCity: String!
    days: Int!
    createdAt: String!
    updatedAt: String!
  }

  input DeliveryTimeInput {
    fromCity: String!
    toCity: String!
    days: Int!
  }

 
  extend type Query {
    getDeliveryTimes: [DeliveryTime!]!
  }

  extend type Mutation {
    createDeliveryTime(input: DeliveryTimeInput!): DeliveryTime!
    updateDeliveryTime(id: ID!, input: DeliveryTimeInput!): DeliveryTime!
    deleteDeliveryTime(id: ID!): Boolean!
  }
`;
