// src/graphql/resolvers/tableResolvers.ts

import { AuthenticationError } from 'apollo-server-express';
import { Types } from 'mongoose';
import TableModel from '../../models/TableModel';

interface Context {
  user?: any;
}

export const tableResolvers = {
  Query: {
    tables: async (
      _: any,
      { restaurantId, status }: { restaurantId: string; status?: string },
      _ctx: Context
    ) => {
      const filter: any = { restaurantId, isActive: true };
      if (status) {
        filter.status = status;
      }
      return TableModel.find(filter).sort({ number: 1 }).exec();
    },

    table: async (
      _: any,
      { id }: { id: string }
    ) => {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }
      return TableModel.findById(id).exec();
    },
  },

  Mutation: {
    createTable: async (
      _: any,
      { input },
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      const table = new TableModel(input);
      await table.save();
      return table;
    },

    updateTable: async (
      _: any,
      { id, input },
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }
      return TableModel.findByIdAndUpdate(id, input, { new: true }).exec();
    },

    deleteTable: async (
      _: any,
      { id }: { id: string },
      { user }: Context
    ): Promise<boolean> => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (!Types.ObjectId.isValid(id)) {
        return false;
      }
      await TableModel.findByIdAndUpdate(id, { isActive: false }).exec();
      return true;
    },
  },
};

