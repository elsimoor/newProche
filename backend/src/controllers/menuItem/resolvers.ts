// menu.resolvers.ts
import {  AuthenticationError } from 'apollo-server-express';
import MenuItemModel from '../../models/MenuItemModel';

interface Context {
  user?: { id: string };
}

interface MenuItemsArgs {
  restaurantId: string;
  category?: string;
}

interface IdArg {
  id: string;
}

type CreateMenuItemInput = any;  // replace with your actual input shape
type UpdateMenuItemInput = any;

interface MutationCreateArgs {
  input: CreateMenuItemInput;
}

interface MutationUpdateArgs {
  id: string;
  input: UpdateMenuItemInput;
}

export const menuResolvers = {
  Query: {
    menuItems: async (
      _parent,
      { restaurantId, category }: MenuItemsArgs
    ) => {
      const filter: Record<string, any> = { restaurantId, isActive: true };
      if (category) filter.category = category;
      return MenuItemModel.find(filter).sort({ category: 1, name: 1 });
    },

    menuItem: async (
      _parent,
      { id }: IdArg
    ) => {
      return MenuItemModel.findById(id);
    }
  },

  Mutation: {
    createMenuItem: async (
      _parent,
      { input }: MutationCreateArgs,
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      const item = new MenuItemModel(input);
      await item.save();
      return item;
    },

    updateMenuItem: async (
      _parent,
      { id, input }: MutationUpdateArgs,
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      return MenuItemModel.findByIdAndUpdate(id, input, { new: true });
    },

    deleteMenuItem: async (
      _parent,
      { id }: IdArg,
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      await MenuItemModel.findByIdAndUpdate(id, { isActive: false });
      return true;
    }
  }
};
