// src/graphql/resolvers/staffResolvers.ts

import { AuthenticationError } from 'apollo-server-express';
import StaffModel from '../../models/StaffModel';

interface Context {
  user?: any;
}

export const staffResolvers = {
  Query: {
    staff: async (
      _: any,
      { businessId, businessType, role }: { businessId: string; businessType: string; role?: string },
      _ctx: Context
    ) => {
      const filter: any = { businessId, businessType, isActive: true };
      if (role) {
        filter.role = new RegExp(role, 'i');
      }
      return StaffModel.find(filter).sort({ name: 1 }).exec();
    },

    staffMember: async (
      _: any,
      { id }: { id: string }
    ) => {
      if (!id) {
        return null;
      }
      return StaffModel.findById(id).exec();
    },
  },

  Mutation: {
    createStaff: async (
      _: any,
      { input }: any,
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      const staff = new StaffModel(input);
      await staff.save();
      return staff;
    },

    updateStaff: async (
      _: any,
      { id, input }: any,
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (!id) {
        return null;
      }
      return StaffModel.findByIdAndUpdate(id, input, { new: true }).exec();
    },

    deleteStaff: async (
      _: any,
      { id }: { id: string },
      { user }: Context
    ): Promise<boolean> => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (!id) {
        return false;
      }
      await StaffModel.findByIdAndUpdate(id, { isActive: false }).exec();
      return true;
    },
  },
};

