"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = exports.resolvers = exports.extendedTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const Business_1 = require("./Business");
const Hotel_1 = require("./Hotel");
const Guest_1 = require("./Guest");
const menuItem_1 = require("./menuItem");
const reservation_1 = require("./reservation");
const Room_1 = require("./Room");
const service_1 = require("./service");
const Staff_1 = require("./Staff");
const Table_1 = require("./Table");
const User_1 = require("./User");
const All_1 = require("./All");
const inputs_1 = require("./inputs");
exports.extendedTypeDefs = (0, apollo_server_express_1.gql) `
  scalar Date
  type Query {
    _: String!
  }
  type Mutation {
    _: String
  }
`;
const resolvers = [
    User_1.userResolvers,
    Business_1.businessResolvers,
    Hotel_1.hotelResolvers,
    Guest_1.guestResolvers,
    menuItem_1.menuResolvers,
    reservation_1.reservationResolvers,
    Room_1.roomResolvers,
    service_1.serviceResolvers,
    Staff_1.staffResolvers,
    Table_1.tableResolvers,
];
exports.resolvers = resolvers;
const typeDefs = [
    User_1.userTypeDefs,
    exports.extendedTypeDefs,
    Business_1.businessTypeDef,
    Hotel_1.hotelTypeDef,
    Guest_1.guestTypeDef,
    menuItem_1.menuItemTypeDef,
    reservation_1.reservationTypeDef,
    Room_1.roomTypeDef,
    service_1.serviceTypeDef,
    Staff_1.staffTypeDef,
    Table_1.tableTypeDefs,
    inputs_1.inputs,
    All_1.root,
];
exports.typeDefs = typeDefs;
//# sourceMappingURL=index.js.map