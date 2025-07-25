import { gql } from 'apollo-server-express';

export const videoTypeDefs = gql`

  # ────────────────── ENTITIES ──────────────────
  type Video {
    id: ID
    title: String
    duration: Int
    image: String
    youtubeId: String
    dentist: User           # populated from dentistId
    createdAt: Date
    updatedAt: Date
  }



  # ────────────────── INPUTS ──────────────────
  input CreateVideoInput {
    title: String
    duration: Int
    image: String
    youtubeId: String
    dentistId: ID          # who owns the video
  }

  input UpdateVideoInput {
    title: String
    duration: Int
    image: String
    youtubeId: String
  }

  # ────────────────── ROOT OPERATIONS ──────────────────
  extend type Query {
    videos: [Video]
    video(id: ID): Video
  }

  extend type Mutation {
    createVideo(input: CreateVideoInput): Video
    updateVideo(id: ID, input: UpdateVideoInput): Video
    deleteVideo(id: ID): Boolean
  }
`;
