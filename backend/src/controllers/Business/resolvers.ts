// business.resolvers.ts
import { AuthenticationError } from 'apollo-server-express';
import RestaurantModel from '../../models/RestaurantModel';
import SalonModel from '../../models/SalonModel';


interface Context {
  user?: { id: string };
}

interface IdArg {
  id: string;
}
// @ts-ignore
type CreateHotelInput = any; 
// @ts-ignore     
type UpdateHotelInput = any;
type CreateRestaurantInput = any;
type UpdateRestaurantInput = any;
type CreateSalonInput = any;
type UpdateSalonInput = any;

interface MutationArgs<I = any> {
  input: I;
}
interface MutationUpdateArgs<I = any> {
  id: string;
  input: I;
}

export const businessResolvers = {
  Query: {
    restaurants: async () => {
      return RestaurantModel.find({ isActive: true }) 
    },
    restaurant: async (_parent, { id }: IdArg) => {
      return RestaurantModel.findById(id) 
    },
    salons: async () => {
      return SalonModel.find({ isActive: true }) 
    },
    salon: async (_parent, { id }: IdArg) => {
      return SalonModel.findById(id) 
    }
  },

  Mutation: {
    createRestaurant: async (
      _parent,
      { input }: MutationArgs<CreateRestaurantInput>,
      { user }: Context
    ) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      const restaurant = new RestaurantModel(input);
      await restaurant.save();
      return restaurant as any;
    },

    updateRestaurant: async (
      _parent,
      { id, input }: MutationUpdateArgs<UpdateRestaurantInput>,
      { user }: Context
    ) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return RestaurantModel.findByIdAndUpdate(id, input, { new: true }) 
    },

    deleteRestaurant: async (
      _parent,
      { id }: IdArg,
      { user }: Context
    ): Promise<boolean> => {
      if (!user) throw new AuthenticationError('Not authenticated');
      await RestaurantModel.findByIdAndUpdate(id, { isActive: false });
      return true;
    },

    createSalon: async (
      _parent,
      { input }: MutationArgs<CreateSalonInput>,
      { user }: Context
    ) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      const salon = new SalonModel(input);
      await salon.save();
      return salon as any;
    },

    updateSalon: async (
      _parent,
      { id, input }: MutationUpdateArgs<UpdateSalonInput>,
      { user }: Context
    ) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return SalonModel.findByIdAndUpdate(id, input, { new: true }) 
    },

    deleteSalon: async (
      _parent,
      { id }: IdArg,
      { user }: Context
    ): Promise<boolean> => {
      if (!user) throw new AuthenticationError('Not authenticated');
      await SalonModel.findByIdAndUpdate(id, { isActive: false });
      return true;
    }
  }
};

