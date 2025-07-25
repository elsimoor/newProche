// guestGuestModel.resolvers.ts
import { AuthenticationError } from 'apollo-server-express';
import GuestModel from '../../models/GuestModel';

interface Context {
  user?: { id: string };
}

interface GuestsArgs {
  businessId: string;
  businessType: string;
  status?: string;
}

interface IdArg {
  id: string;
}

type CreateGuestInput = any;   // replace with your actual input type
type UpdateGuestInput = any;

interface MutationCreateArgs {
  input: CreateGuestInput;
}

interface MutationUpdateArgs {
  id: string;
  input: UpdateGuestInput;
}

export const guestResolvers = {
  Query: {
    guests: async (
      _parent,
      { businessId, businessType, status }: GuestsArgs
    ): Promise<any[]> => {
      const filter: Record<string, any> = { businessId, businessType };
      if (status) filter.status = status;
      return GuestModel.find(filter).sort({ name: 1 });
    },

    guest: async (
      _parent,
      { id }: IdArg
    ): Promise<any | null> => {
      return GuestModel.findById(id);
    }
  },

  Mutation: {
    createGuest: async (
      _parent,
      { input }: MutationCreateArgs,
    ): Promise<any> => {
      
      const guest = new GuestModel(input);
      await guest.save();
      return guest;
    },

    updateGuest: async (
      _parent,
      { id, input }: MutationUpdateArgs,
      { user }: Context
    ): Promise<any | null> => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      return GuestModel.findByIdAndUpdate(id, input, { new: true });
    },

    deleteGuest: async (
      _parent,
      { id }: IdArg,
      { user }: Context
    ): Promise<boolean> => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      await GuestModel.findByIdAndDelete(id);
      return true;
    }
  }
};
