import { verifyToken } from '../../middlewares';
import { VideoModel, UserModel } from '../../models';

export const videoResolvers = {
  // ──────────── Queries ────────────
  Query: {
    videos: async (
      _: any,
      __: any
      // { req }: any,
    ) => {
      // const { id } = await verifyToken(req);
      return VideoModel.find();
    },
    video: (_, { id }) => VideoModel.findById(id),
  },

  // ─────────── Mutations ───────────
  Mutation: {
    createVideo: async (_, { input }, { req }: any) => {
      const { id } = await verifyToken(req);
      const { ...rest } = input;

      // make sure the dentist/user exists
      const dentist: any = await UserModel.findById(id);
      if (!dentist) throw new Error('Dentist not found');

      // create & save the clip
      const video = await VideoModel.create({ ...rest, dentistId: id });

      // attach the clip to the dentist’s profile
      dentist.videos?.push(video.id);
      await dentist.save();

      return video;
    },

    updateVideo: async (_, { id, input }) => {
      return VideoModel.findByIdAndUpdate(id, input, { new: true });
    },

    deleteVideo: async (_, { id }) => {
      const video = await VideoModel.findByIdAndDelete(id);
      if (!video) return false;

      // remove the reference from the dentist
      await UserModel.findByIdAndUpdate(video.dentistId, {
        $pull: { videos: video.id },
      });

      return true;
    },
  },

  // ───────── Field-level resolvers ─────────
  Video: {
    dentist: async ({ dentist }, _, { Loaders }) => {
      return (await dentist) ? await Loaders.user.load(dentist) : null;
    },
  }
};
