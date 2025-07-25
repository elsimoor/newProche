import { generateToken, verifyToken } from "../../middlewares";
import bcryptjs from "bcryptjs";
import { DentistFromContactUsModel, InvoiceModel, PatientModel, UserModel } from "../../models";

export const userResolvers = {
  Query: {

    getAllDentists: async () => {
      return UserModel.find({ role: "ADMIN", isDeleted: { $ne: true } })
        .sort({ createdAt: -1 });
    },

    getRevenueStats: async () => {

      const [totalDentists, totalPatients, totalTreatments] = await Promise.all([
        UserModel.countDocuments({ role: "ADMIN" }),
        PatientModel.countDocuments(),
        PatientModel.countDocuments({ isBoVerifyIt: true }),
      ])

      /* ---------- total revenue ---------- */
      const [{ totalRevenue = 0 } = {}] = await InvoiceModel.aggregate([
        { $match: { status: "Paye" } },
        { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
      ])

      /* ---------- monthly revenue (+ previous year) ---------- */
      const year = new Date().getFullYear()
      const dateStart = new Date(`${year}-01-01T00:00:00.000Z`)
      const dateEnd = new Date(`${year + 1}-01-01T00:00:00.000Z`)
      const prevStart = new Date(`${year - 1}-01-01T00:00:00.000Z`)
      const prevEnd = new Date(`${year}-01-01T00:00:00.000Z`)

      /** helper that returns { "2024-05": 1234, … }  */
      const monthly = async (match: any) => {
        const docs = await InvoiceModel.aggregate([
          { $match: match },
          {
            $group: {
              _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
              revenue: { $sum: "$amount" },
            },
          },
        ])
        return Object.fromEntries(
          docs.map(d => [
            `${d._id.y}-${String(d._id.m).padStart(2, "0")}`,
            d.revenue,
          ]),
        )
      }

      const cur = await monthly({ createdAt: { $gte: dateStart, $lt: dateEnd }, status: "Paye" })
      const prev = await monthly({ createdAt: { $gte: prevStart, $lt: prevEnd }, status: "Paye" })
      const monthlyRevenue = Array.from({ length: 12 }).map((_, i) => {
        const month = `${year}-${String(i + 1).padStart(2, "0")}`
        return {
          month,
          revenue: cur[month] ?? 0,
          prevYearRevenue: prev[`${year - 1}-${String(i + 1).padStart(2, "0")}`] ?? 0,
        }
      })

      return {
        totalDentists,
        totalPatients,
        totalTreatments,
        totalRevenue,
        monthlyRevenue,
      }

    },
    dentists: async () =>
      UserModel.find({ role: "ADMIN", isDeleted: { $ne: true } }).sort({ createdAt: -1 }),

    GetdentistsContactUs: async () => {
      const newDetists = await DentistFromContactUsModel.find({ role: "ADMIN", isDeleted: { $ne: true } }).sort({ createdAt: -1 });
      const users = await UserModel.find({ role: "ADMIN" });
      // return new - old 
      return newDetists.filter(d => !users.some(u => u.email === d.email));
    },
    GetdentistsContactUsById: async (_: any, { id }) => {
      const dentist = await DentistFromContactUsModel.findById(id);
      if (!dentist) throw new Error("Dentist not found");
      return dentist;
    },

    dentist: async (_: any, { id }) =>
      UserModel.findOne({ _id: id, role: "ADMIN", isDeleted: { $ne: true } }),
    users: async () => {
      return UserModel.find();
    },
    user: async (_, { id }) => {
      return UserModel.findById(id);
    },
    profile: async (_, __, { req }: any) => {
      const { id } = await verifyToken(req);
      if (!id) throw new Error("Not authenticated");

      return UserModel.findById(id);
    },

  },

  Mutation: {
    createNewDentist: async (_parent, { input }, _ctx) => {
      // hash du mot de passe obligatoire
      // const hashedPw = await bcryptjs.hash(input.password, 10);

      const dentist = await DentistFromContactUsModel.create({
        ...input,
        // password: hashedPw,
        role: "ADMIN",
      });

      return dentist;
    },
    createDentist: async (_: any, { input }) => {
      const hash = await bcryptjs.hash(input.password, 10);
      const dentist = new UserModel({
        ...input,
        password: hash,
        role: "ADMIN",
      });
      await dentist.save();
      return dentist;
    },
    createAdmin: async (_: any, { input }, { req }) => {
      const { role } = await verifyToken(req);
      if (!(role === "SUPERADMIN")) return;
      const hash = await bcryptjs.hash(input.password, 10);
      const admin = new UserModel({ ...input, password: hash, role: "SUPERADMIN" });
      await admin.save();
      return admin;
    },

    /* ---------- UPDATE ---------- */
    updateDentist: async (_: any, { id, input },) => {

      const patch: any = { ...input };
      if (input.password) patch.password = await bcryptjs.hash(input.password, 10);

      return UserModel.findOneAndUpdate(
        { _id: id, role: "ADMIN" },
        { $set: patch },
        { new: true }
      );
    },

    deleteDentist: async (_: any, { id }) => {
      const dent = await UserModel.findOne({ _id: id, role: "ADMIN" });
      if (!dent) throw new Error("Dentist not found");

      dent.isDeleted = true;
      await dent.save();
      return { success: true, message: "Dentist deleted" };
    },


    login: async (_, { input }) => {
      const { email, password } = input;
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          throw new Error("Email Or password incorrect");
        }

        if (user.isDeleted) {
          throw new Error("Account deleted, please contact support");
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Email Or password incorrect");
        }
        await user.save();
        const token = await generateToken(user.id, user.email, user.role);
        return { user, token };
      } catch (error) {
        throw error;
      }
    },
    updateProfile: async (_, { input }, { req }: any) => {
      const { id } = await verifyToken(req);
      if (!id) throw new Error("Not authenticated");


      const updated = await UserModel.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true }
      );

      return updated;
    },

    changePassword: async (_, { input }, { req }: any) => {
      const { id } = await verifyToken(req);
      if (!id) throw new Error("Not authenticated");

      const { currentPassword, newPassword } = input;
      const user = await UserModel.findById(id);
      if (!user) throw new Error("User not found");

      const ok = await bcryptjs.compare(currentPassword, user.password);
      if (!ok)
        return { success: false, message: "Current password is incorrect" };

      user.password = await bcryptjs.hash(newPassword, 10);
      await user.save();

      return { success: true, message: "Password updated successfully" };
    },
    changePasswordBO: async (_, { input }, { req }: any) => {
      const { role } = await verifyToken(req);
      if (role !== "SUPERADMIN") throw new Error("Not authorized");

      const { newPassword, id } = input;
      const user = await UserModel.findById(id);
      if (!user) throw new Error("User not found");

      user.password = await bcryptjs.hash(newPassword, 10);
      await user.save();

      return { success: true, message: "Password updated successfully" };
    },

    deleteAccount: async (_, __, { req }: any) => {
      try {
        const { id } = await verifyToken(req);
        if (!id) throw new Error("Not authenticated");
        let user = await UserModel.findById(id);
        if (!user) throw new Error("User not found");
        user.isDeleted = true;
        await user.save();
        return { success: true, message: "Account deleted" };
      } catch (error) {
        throw error;
      }
    },
  },
  User: {
    doctor: async ({ doctorId }, _, { Loaders }) => {
      return (await doctorId) ? await Loaders.user.load(doctorId) : null;
    },
    patients: async ({ patients }: any, _, { Loaders }) => {
      try {
        return patients.map(async (e: any) => {
          return (await e) ? Loaders.patients.load(e) : null;
        });
      } catch (error) {
        throw error;
      }
    },
    videos: async ({ videos }: any, _, { Loaders }) => {
      try {
        return videos.map(async (e: any) => {
          return (await e) ? Loaders.video.load(e) : null;
        });
      } catch (error) {
        throw error;
      }
    },

  }
};


