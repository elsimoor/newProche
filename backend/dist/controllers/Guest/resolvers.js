"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestResolvers = void 0;
// guestGuestModel.resolvers.ts
const apollo_server_express_1 = require("apollo-server-express");
const GuestModel_1 = __importDefault(require("../../models/GuestModel"));
exports.guestResolvers = {
    Query: {
        guests: async (_parent, { businessId, businessType, status }) => {
            const filter = { businessId, businessType };
            if (status)
                filter.status = status;
            return GuestModel_1.default.find(filter).sort({ name: 1 });
        },
        guest: async (_parent, { id }) => {
            return GuestModel_1.default.findById(id);
        }
    },
    Mutation: {
        createGuest: async (_parent, { input }) => {
            const guest = new GuestModel_1.default(input);
            await guest.save();
            return guest;
        },
        updateGuest: async (_parent, { id, input }, { user }) => {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            }
            return GuestModel_1.default.findByIdAndUpdate(id, input, { new: true });
        },
        deleteGuest: async (_parent, { id }, { user }) => {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            }
            await GuestModel_1.default.findByIdAndDelete(id);
            return true;
        }
    }
};
//# sourceMappingURL=resolvers.js.map