import { gql } from "apollo-server-express";

export const holidayTypeDefs = gql`

  type Holiday {
    id: ID!
    date: Date!
    description: String!
    createdAt: Date!
    updatedAt: Date!
  }

  extend type Query {
    holidays: [Holiday!]!
  }

  input AddHolidayInput {
    date: Date!
    description: String!
  }

   type DeleteResult {
    success: Boolean!
  }

  extend type Mutation {
    addHoliday(input: AddHolidayInput!): Holiday!
    deleteHoliday(id: ID!): DeleteResult!
  }
`;
