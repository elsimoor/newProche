import { HolidayModel } from "../../models";

export const holidayResolvers = {
  Query: {
    holidays: async () => {
      return HolidayModel.find({}).sort({ date: 1 });
    },
  },

  Mutation: {
    addHoliday: async (_parent, { input }) => {
      const existing = await HolidayModel.findOne({
        date: {
          $gte: new Date(input.date).setHours(0, 0, 0, 0),
          $lte: new Date(input.date).setHours(23, 59, 59, 999),
        },
      });

      if (existing) {
        throw new Error("Un jour férié existe déjà à cette date.");
      }

      return HolidayModel.create({
        date: input.date,
        description: input.description,
      });
    },

    deleteHoliday: async (_parent, { id }) => {
      await HolidayModel.findByIdAndDelete(id);
      return { success: true };
    },
  },
};
