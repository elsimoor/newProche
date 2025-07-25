import { gql } from "apollo-server-express";
import { userResolvers, userTypeDefs } from "./User";
import { patientResolvers, patientTypeDefs } from "./Patient";
import { invoiceResolvers, invoiceTypeDefs } from "./Invoice";
import { deliveryTimeResolvers, deliveryTimeTypeDefs } from "./deliveryTime"
import { holidayResolvers, holidayTypeDefs } from "./holiday"
import { sessionResolvers, SessionTypeDefs } from "./session"

import { videoResolvers, videoTypeDefs } from "./Video";
import { historiqueResolvers, HistoriqueTypeDefs } from "./historique"

export const extendedTypeDefs = gql`
  scalar Date
  type Query {
    _: String!
  }
  type Mutation {
    _: String
  }
`;

const resolvers = [
  userResolvers,
  patientResolvers,
  invoiceResolvers,
  videoResolvers,
  deliveryTimeResolvers,
  holidayResolvers,
  sessionResolvers,
  historiqueResolvers

];
const typeDefs = [
  userTypeDefs,
  extendedTypeDefs,
  patientTypeDefs,
  invoiceTypeDefs,
  videoTypeDefs,
  deliveryTimeTypeDefs,
  holidayTypeDefs,
  SessionTypeDefs,
  HistoriqueTypeDefs
];
export { resolvers, typeDefs };
