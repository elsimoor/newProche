import {
  PatientModel,
  UserModel,
  VideoModel,
} from "../models";


const BatchUsers = async (ids: any) => {
  const users = await UserModel.find({ _id: { $in: ids } })
  return ids.map((id: any) => users.find((user: any) => user.id == id));
};

const BatchPatients = async (ids: any) => {
  const patients = await PatientModel.find({ _id: { $in: ids } })
  return ids.map((id: any) => patients.find((patient: any) => patient.id == id));
};


const BatchVideos = async (ids: any) => {
  const videos = await VideoModel.find({ _id: { $in: ids } })
  return ids.map((id: any) => videos.find((video: any) => video.id == id));
}


export {
  BatchUsers,
  BatchPatients,
  BatchVideos,
};
