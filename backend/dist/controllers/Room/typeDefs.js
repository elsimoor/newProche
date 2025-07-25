"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomTypeDef = void 0;
// room.schema.ts
const apollo_server_express_1 = require("apollo-server-express");
exports.roomTypeDef = (0, apollo_server_express_1.gql) `

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
//# sourceMappingURL=typeDefs.js.map