// room.resolvers.ts
import { IResolvers, AuthenticationError } from 'apollo-server-express';
import RoomModel from '../../models/RoomModel';

interface Context {
  user?: { id: string };
}

interface RoomsArgs {
  hotelId: string;
  status?: string;
}

interface IdArg {
  id: string;
}

type CreateRoomInput = any;    // replace with your actual input shape
type UpdateRoomInput = any;

interface MutationCreateArgs {
  input: CreateRoomInput;
}

interface MutationUpdateArgs {
  id: string;
  input: UpdateRoomInput;
}

export const roomResolvers: IResolvers<unknown, Context> = {
  Query: {
    rooms: async (
      _parent,
      { hotelId, status }: RoomsArgs
    ) => {
      const filter: Record<string, any> = { hotelId, isActive: true };
      if (status) filter.status = status;
      return await RoomModel.find(filter).sort({ number: 1 });
    },

    room: async (
      _parent,
      { id }: IdArg
    ) => {
      return await RoomModel.findById(id);
    }
  },

  Mutation: {
    createRoom: async (
      _parent,
      { input }: MutationCreateArgs,
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      const room = new RoomModel(input);
      await room.save();
      return room;
    },

    updateRoom: async (
      _parent,
      { id, input }: MutationUpdateArgs,
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      return await RoomModel.findByIdAndUpdate(id, input, { new: true });
    },

    deleteRoom: async (
      _parent,
      { id }: IdArg,
      { user }: Context
    ): Promise<boolean> => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      await RoomModel.findByIdAndUpdate(id, { isActive: false });
      return true;
    }
  }
};
