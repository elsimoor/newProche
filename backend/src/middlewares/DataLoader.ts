import HotelModel from "../models/HotelModel";
import RoomModel from "../models/RoomModel";
import ServiceModel from "../models/ServiceModel";
import StaffModel from "../models/StaffModel";
import TableModel from "../models/TableModel";
import UserModel from "../models/UserModel";



const BatchUsers = async (ids: any) => {
  const users = await UserModel.find({ _id: { $in: ids } })
  return ids.map((id: any) => users.find((user: any) => user.id == id));
};


const BatchBusiness = async (ids: any) => {
  // Implement your logic to batch load businesses
  const businesss = await HotelModel.find({ _id: { $in: ids } });
  return ids.map((id: any) => businesss.find((business: any) => business.id == id));
};

const BatchRoom = async (ids: any) => {
  // Implement your logic to batch load rooms
  const rooms = await RoomModel.find({ _id: { $in: ids } });
  return ids.map((id: any) => rooms.find((room: any) => room.id == id));
};

const BatchTable = async (ids: any) => {
  // Implement your logic to batch load tables
  // Assuming you have a TableModel
  const tables = await TableModel.find({ _id: { $in: ids } });
  return ids.map((id: any) => tables.find((table: any) => table.id == id));
};

const BatchService = async (ids: any) => {
  // Implement your logic to batch load services
  // Assuming you have a ServiceModel
  const services = await ServiceModel.find({ _id: { $in: ids } });
  return ids.map((id: any) => services.find((service: any) => service.id == id));
};


const BatchUStaff = async (ids: any) => {
  // Implement your logic to batch load staff
  const staff = await StaffModel.find({ _id: { $in: ids }, role: 'staff' });
  return ids.map((id: any) => staff.find((s: any) => s.id == id));
};




export {
  BatchUsers,
  BatchBusiness,
  BatchRoom,
  BatchTable,
  BatchService,
  BatchUStaff,
};
