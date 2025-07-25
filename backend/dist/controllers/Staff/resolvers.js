"use strict";
// src/graphql/resolvers/staffResolvers.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffResolvers = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = require("mongoose");
const StaffModel_1 = __importDefault(require("../../models/StaffModel"));
exports.staffResolvers = {
    Query: {
        staff: async (_, { businessId, businessType, role }, _ctx) => {
            const filter = { businessId, businessType, isActive: true };
            if (role) {
                filter.role = new RegExp(role, 'i');
            }
            return StaffModel_1.default.find(filter).sort({ name: 1 }).exec();
        },
        staffMember: async (_, { id }) => {
            if (!mongoose_1.id) {
                return null;
            }
            return StaffModel_1.default.findById(id).exec();
        },
    },
    Mutation: {
        createStaff: async (_, { input }, { user }) => {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            }
            const staff = new StaffModel_1.default(input);
            await staff.save();
            return staff;
        },
        updateStaff: async (_, { id, input }, { user }) => {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            }
            if (!mongoose_1.id) {
                return null;
            }
            return StaffModel_1.default.findByIdAndUpdate(id, input, { new: true }).exec();
        },
        deleteStaff: async (_, { id }, { user }) => {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            }
            if (!mongoose_1.id) {
                return false;
            }
            await StaffModel_1.default.findByIdAndUpdate(id, { isActive: false }).exec();
            return true;
        },
    },
};
//# sourceMappingURL=resolvers.js.map