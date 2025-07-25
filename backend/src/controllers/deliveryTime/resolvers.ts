import { DeliveryTimeModel } from "../../models";

export const deliveryTimeResolvers = {
  Query: {
    getDeliveryTimes: async () => {
      return DeliveryTimeModel.find().sort({ fromCity: 1, toCity: 1 });
    },
  },

  Mutation: {
    createDeliveryTime: async (_: any, { input }) => {
      const doc = await DeliveryTimeModel.create(input);
      return doc;
    },

    updateDeliveryTime: async (_: any, { id, input }) => {
      const doc = await DeliveryTimeModel.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      });
      if (!doc) throw new Error("Delivery time not found");
      return doc;
    },

    deleteDeliveryTime: async (_: any, { id }) => {
      const res = await DeliveryTimeModel.findByIdAndDelete(id);
      return Boolean(res);
    },
  },
};
