"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelTypeDef = void 0;
// FIX: Moved Hotel type definition to its own file
const apollo_server_express_1 = require("apollo-server-express");
exports.hotelTypeDef = (0, apollo_server_express_1.gql) `
  type Hotel {
    id: ID!
    name: String!
    description: String
    address: Address
    contact: Contact
    settings: HotelSettings
    amenities: [Amenity!]!
    services: [BusinessService!]!
    policies: [Policy!]!
    images: [String!]!
    rating: Rating
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }
`;
//# sourceMappingURL=typeDefs.js.map