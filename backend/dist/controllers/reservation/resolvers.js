"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationResolvers = void 0;
// reservation.resolvers.ts
// import {  AuthenticationError } from 'apollo-server-express';
const ReservationModel_1 = __importDefault(require("../../models/ReservationModel"));
exports.reservationResolvers = {
    Query: {
        reservations: async (_parent, { businessId, businessType, status, date }) => {
            const filter = { businessId, businessType };
            if (status)
                filter.status = status;
            if (date) {
                const startDate = new Date(date);
                const endDate = new Date(date);
                endDate.setDate(endDate.getDate() + 1);
                filter.date = { $gte: startDate, $lt: endDate };
            }
            return ReservationModel_1.default.find(filter)
                .sort({ date: -1 });
        },
        reservation: async (_parent, { id }) => {
            return ReservationModel_1.default.findById(id);
        }
    },
    Mutation: {
        createReservation: async (_parent, { input }) => {
            const reservation = new ReservationModel_1.default(input);
            await reservation.save();
            return ReservationModel_1.default.findById(reservation._id);
        },
        updateReservation: async (_parent, { id, input }) => {
            const reservation = await ReservationModel_1.default.findByIdAndUpdate(id, input, { new: true });
            return reservation;
        },
        deleteReservation: async (_parent, { id }) => {
            // if (!user) {
            //   throw new AuthenticationError('Not authenticated');
            // }
            await ReservationModel_1.default.findByIdAndDelete(id);
            return true;
        }
    },
    Reservation: {
        businessId: async ({ businessId }, _, { Loaders }) => {
            return (await businessId) ? await Loaders.business.load(businessId) : null;
        },
        customerId: async ({ customerId }, _, { Loaders }) => {
            return (await customerId) ? await Loaders.user.load(customerId) : null;
        },
        roomId: async ({ roomId }, _, { Loaders }) => {
            return (await roomId) ? await Loaders.room.load(roomId) : null;
        },
        tableId: async ({ tableId }, _, { Loaders }) => {
            return (await tableId) ? await Loaders.table.load(tableId) : null;
        },
        serviceId: async ({ serviceId }, _, { Loaders }) => {
            return (await serviceId) ? await Loaders.service.load(serviceId) : null;
        },
        staffId: async ({ staffId }, _, { Loaders }) => {
            return (await staffId) ? await Loaders.staff.load(staffId) : null;
        }
    }
};
//# sourceMappingURL=resolvers.js.map