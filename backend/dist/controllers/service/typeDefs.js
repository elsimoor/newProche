"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceTypeDef = void 0;
// service.schema.ts
const apollo_server_express_1 = require("apollo-server-express");
exports.serviceTypeDef = (0, apollo_server_express_1.gql) `

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
//# sourceMappingURL=typeDefs.js.map