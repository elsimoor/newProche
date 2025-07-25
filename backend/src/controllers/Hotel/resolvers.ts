// FIX: Moved Hotel resolvers to its own file
import { AuthenticationError } from 'apollo-server-express';
import HotelModel from '../../models/HotelModel';

interface Context {
  user?: { id: string };
}

interface IdArg {
  id: string;
}

type CreateHotelInput = any;
type UpdateHotelInput = any;

interface MutationArgs<I = any> {
  input: I;
}
interface MutationUpdateArgs<I = any> {
  id: string;
  input: I;
}

export const hotelResolvers = {
  Query: {
    hotels: async () => {
      return HotelModel.find({ isActive: true })
    },
    hotel: async (_parent, { id }: IdArg) => {
      return HotelModel.findById(id)
    },
  },

  Mutation: {
    createHotel: async (
      _parent,
      { input }: MutationArgs<CreateHotelInput>,
      { user }: Context
    ) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      const hotel = new HotelModel(input);
      await hotel.save();
      return hotel as any;
    },

    updateHotel: async (
      _parent,
      { id, input }: MutationUpdateArgs<UpdateHotelInput>,
      { user }: Context
    ) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return HotelModel.findByIdAndUpdate(id, input, { new: true })
    },

    deleteHotel: async (
      _parent,
      { id }: IdArg,
      { user }: Context
    ): Promise<boolean> => {
      if (!user) throw new AuthenticationError('Not authenticated');
      await HotelModel.findByIdAndUpdate(id, { isActive: false });
      return true;
    },
  }
};
