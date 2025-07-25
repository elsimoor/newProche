"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessResolvers = void 0;
// business.resolvers.ts
const apollo_server_express_1 = require("apollo-server-express");
const RestaurantModel_1 = __importDefault(require("../../models/RestaurantModel"));
const SalonModel_1 = __importDefault(require("../../models/SalonModel"));
exports.businessResolvers = {
    Query: {
        restaurants: async () => {
            return RestaurantModel_1.default.find({ isActive: true });
        },
        restaurant: async (_parent, { id }) => {
            return RestaurantModel_1.default.findById(id);
        },
        salons: async () => {
            return SalonModel_1.default.find({ isActive: true });
        },
        salon: async (_parent, { id }) => {
            return SalonModel_1.default.findById(id);
        }
    },
    Mutation: {
        createRestaurant: async (_parent, { input }, { user }) => {
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            const restaurant = new RestaurantModel_1.default(input);
            await restaurant.save();
            return restaurant;
        },
        updateRestaurant: async (_parent, { id, input }, { user }) => {
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            return RestaurantModel_1.default.findByIdAndUpdate(id, input, { new: true });
        },
        deleteRestaurant: async (_parent, { id }, { user }) => {
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            await RestaurantModel_1.default.findByIdAndUpdate(id, { isActive: false });
            return true;
        },
        createSalon: async (_parent, { input }, { user }) => {
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            const salon = new SalonModel_1.default(input);
            await salon.save();
            return salon;
        },
        updateSalon: async (_parent, { id, input }, { user }) => {
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            return SalonModel_1.default.findByIdAndUpdate(id, input, { new: true });
        },
        deleteSalon: async (_parent, { id }, { user }) => {
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            await SalonModel_1.default.findByIdAndUpdate(id, { isActive: false });
            return true;
        }
    }
};
//# sourceMappingURL=resolvers.js.map