// reservation.resolvers.ts
// import {  AuthenticationError } from 'apollo-server-express';
import ReservationModel from '../../models/ReservationModel';

// interface Context {
//   user?: { id: string };
// }

interface ReservationsArgs {
  businessId: string;
  businessType: string;
  status?: string;
  date?: string;
}

interface IdArg {
  id: string;
}

// type CreateReservationInput = any;  // replace with your actual input type
type UpdateReservationInput = any;



interface MutationUpdateArgs {
  id: string;
  input: UpdateReservationInput;
}

export const reservationResolvers = {
  Query: {
    reservations: async (
      _parent,
      { businessId, businessType, status, date }: ReservationsArgs
    ) => {
      const filter: Record<string, any> = { businessId, businessType };
      if (status) filter.status = status;
      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        filter.date = { $gte: startDate, $lt: endDate };
      }

      return ReservationModel.find(filter)
        .sort({ date: -1 });
    },

    reservation: async (_parent, { id }: IdArg) => {
      return ReservationModel.findById(id)

    }
  },

  Mutation: {
    createReservation: async (
      _parent,
      { input },
      
    ) => {
      const reservation = new ReservationModel(input);
      await reservation.save();
      return ReservationModel.findById(reservation._id)
        
    },

    updateReservation: async (
      _parent,
      { id, input }: MutationUpdateArgs,
      
    ) => {
      const reservation = await ReservationModel.findByIdAndUpdate(id, input, { new: true })
        
      return reservation;
    },

    deleteReservation: async (
      _parent,
      { id }: IdArg,
      
    ): Promise<boolean> => {
      // if (!user) {
      //   throw new AuthenticationError('Not authenticated');
      // }
      await ReservationModel.findByIdAndDelete(id);
      return true;
    }
  },
  Reservation: {
    businessId: async ({ businessId }, _, { Loaders }) => {
      return (await businessId) ? await Loaders.business.load(businessId) : null;
    },
    customerId: async ({ customerId }, _, { Loaders }) => {
      return (await customerId) ? await Loaders.user.load(customerId) : null;
    },
    roomId: async ({ roomId }, _, { Loaders }) => {
      return (await roomId) ? await Loaders.room.load(roomId) : null;
    },
    tableId: async ({ tableId }, _, { Loaders }) => {
      return (await tableId) ? await Loaders.table.load(tableId) : null;
    },
    serviceId: async ({ serviceId }, _, { Loaders }) => {
      return (await serviceId) ? await Loaders.service.load(serviceId) : null;
    },
    staffId: async ({ staffId }, _, { Loaders }) => {
      return (await staffId) ? await Loaders.staff.load(staffId) : null;
    }
  }
};
