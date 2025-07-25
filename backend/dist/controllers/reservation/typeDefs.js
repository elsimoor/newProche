"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationTypeDef = void 0;
// reservation.schema.ts
const apollo_server_express_1 = require("apollo-server-express");
exports.reservationTypeDef = (0, apollo_server_express_1.gql) `

  type Reservation {
    id: ID!
    businessId: Hotel
    businessType: String!
    customerId: User
    customerInfo: CustomerInfo!

    # Hotel specific
    roomId: Room
    checkIn: Date
    checkOut: Date
    guests: Int

    # Restaurant specific
    tableId: Table
    partySize: Int

    # Salon specific
    serviceId: Service
    staffId: Staff

    # Common fields
    date: Date!
    time: String
    duration: Int
    status: String!
    totalAmount: Float
    paymentStatus: String!
    notes: String
    specialRequests: String
    reminderSent: Boolean!
    source: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type CustomerInfo {
    name: String!
    email: String!
    phone: String!
  }
`;
//# sourceMappingURL=typeDefs.js.map