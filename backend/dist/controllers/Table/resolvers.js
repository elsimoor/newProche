"use strict";
// src/graphql/resolvers/tableResolvers.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableResolvers = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = require("mongoose");
const TableModel_1 = __importDefault(require("../../models/TableModel"));
exports.tableResolvers = {
    Query: {
        tables: async (_, { restaurantId, status }, _ctx) => {
            const filter = { restaurantId, isActive: true };
            if (status) {
                filter.status = status;
            }
            return TableModel_1.default.find(filter).sort({ number: 1 }).exec();
        },
        table: async (_, { id }) => {
            if (!mongoose_1.id) {
                return null;
            }
            return TableModel_1.default.findById(id).exec();
        },
    },
    Mutation: {
        createTable: async (_, { input }, { user }) => {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            }
            const table = new TableModel_1.default(input);
            await table.save();
            return table;
        },
        updateTable: async (_, { id, input }, { user }) => {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            }
            if (!mongoose_1.id) {
                return null;
            }
            return TableModel_1.default.findByIdAndUpdate(id, input, { new: true }).exec();
        },
        deleteTable: async (_, { id }, { user }) => {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            }
            if (!mongoose_1.id) {
                return false;
            }
            await TableModel_1.default.findByIdAndUpdate(id, { isActive: false }).exec();
            return true;
        },
    },
};
//# sourceMappingURL=resolvers.js.map