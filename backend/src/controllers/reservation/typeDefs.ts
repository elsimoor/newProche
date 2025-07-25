// reservation.schema.ts
import { gql } from 'apollo-server-express';

export const reservationTypeDef = gql`

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
