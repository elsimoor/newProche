"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelResolvers = void 0;
// FIX: Moved Hotel resolvers to its own file
const apollo_server_express_1 = require("apollo-server-express");
const HotelModel_1 = __importDefault(require("../../models/HotelModel"));
exports.hotelResolvers = {
    Query: {
        hotels: async () => {
            return HotelModel_1.default.find({ isActive: true });
        },
        hotel: async (_parent, { id }) => {
            return HotelModel_1.default.findById(id);
        },
    },
    Mutation: {
        createHotel: async (_parent, { input }, { user }) => {
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            const hotel = new HotelModel_1.default(input);
            await hotel.save();
            return hotel;
        },
        updateHotel: async (_parent, { id, input }, { user }) => {
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            return HotelModel_1.default.findByIdAndUpdate(id, input, { new: true });
        },
        deleteHotel: async (_parent, { id }, { user }) => {
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            await HotelModel_1.default.findByIdAndUpdate(id, { isActive: false });
            return true;
        },
    }
};
//# sourceMappingURL=resolvers.js.map