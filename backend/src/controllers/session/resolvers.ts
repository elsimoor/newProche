// src/graphql/resolvers/sessionSessionModel.ts

import { SessionModel } from "../../models";

export const sessionResolvers = {
  Mutation: {
    async addSessionImage(_: any, { input }: { input: any }) {
      const { sessionId, url, images }: any = input;
      if (!sessionId || !url) throw new Error("sessionId & url required");

      const update = await SessionModel.findOneAndUpdate(
        { sessionId },
        { $push: { images: images } },
        { new: true }
      );

      if (!update) throw new Error("Session not found");
      return update.images[update.images.length - 1];   // the image we just added
    },
    /** Create + save the OTP entry */
    async createSession(_: any, { input }: { input: any }) {
      console.log('createSession', input);
      // check if the sessionId is already used override the otp
      const { sessionId, patientId, otp, dentistUid,imageType } = input;
      if (!sessionId || !patientId || !otp) throw new Error('Missing required fields');
      if (otp.length !== 6) throw new Error('Invalid OTP length');
      const existingSession = await SessionModel.findOne({ sessionId, patientId, dentistUid });
      if (existingSession) {
        // Update existing session with new OTP and expiration
        existingSession.otp = otp;
        existingSession.imageType = imageType || existingSession.imageType; // Update imageType if provided
        return await existingSession.save();
      }
      // Create a new session

      return await SessionModel.create(input);
    },

    /** Validate then burn OTP (one-time use) */
    async verifyOtp(_: any, { input }: any) {
      try {
        const { sessionId, otp, patientId, dentistUid } = input;
        if (!sessionId || !otp || !patientId) throw new Error('Missing required fields');
        if (otp.length !== 6) throw new Error('Invalid OTP length');

        const doc = await SessionModel.findOne({ sessionId, patientId, otp, dentistUid });
        console.log('verifyOtp', { sessionId, otp, patientId, dentistUid });
        console.log('verifyOtp doc', doc);
        if (!doc) throw new Error('Invalid session');
        if (doc.expiresAt < new Date()) {
          // await doc.deleteOne();
          throw new Error('OTP expired');
        }

        return true;
      } catch (error) {
        console.error('Error in verifyOtp:', error);
        throw new Error(error.message || 'An error occurred while verifying OTP');
      }
    }
  }
};
