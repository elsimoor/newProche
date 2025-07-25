"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomResolvers = void 0;
// room.resolvers.ts
const apollo_server_express_1 = require("apollo-server-express");
const RoomModel_1 = __importDefault(require("../../models/RoomModel"));
exports.roomResolvers = {
    Query: {
        rooms: async (_parent, { hotelId, status }) => {
            const filter = { hotelId, isActive: true };
            if (status)
                filter.status = status;
            return await RoomModel_1.default.find(filter).sort({ number: 1 });
        },
        room: async (_parent, { id }) => {
            return await RoomModel_1.default.findById(id);
        }
    },
    Mutation: {
        createRoom: async (_parent, { input }, { user }) => {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            }
            const room = new RoomModel_1.default(input);
            await room.save();
            return room;
        },
        updateRoom: async (_parent, { id, input }, { user }) => {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            }
            return await RoomModel_1.default.findByIdAndUpdate(id, input, { new: true });
        },
        deleteRoom: async (_parent, { id }, { user }) => {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            }
            await RoomModel_1.default.findByIdAndUpdate(id, { isActive: false });
            return true;
        }
    }
};
//# sourceMappingURL=resolvers.js.map