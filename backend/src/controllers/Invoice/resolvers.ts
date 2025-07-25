import { InvoiceModel, UserModel } from "../../models";
import { verifyToken } from "../../middlewares";

export const invoiceResolvers = {
  Query: {
    getInvoices: async (_, __, { req }) => {
      const { id, role } = await verifyToken(req);
      console.log(role)

      if (role === "SUPERADMIN") {
        let data = await await InvoiceModel.find({}).sort({ createdAt: -1 });
        console.log(data)

        return data;
      }

      let data = await InvoiceModel.find({ DentistID: id }).sort({ createdAt: -1 });
      console.log(data)

      return data;
    },

    getInvoiceById: async (_, { id: invoiceId }, { req }) => {
      const { id, role } = await verifyToken(req);
      const invoice = await InvoiceModel.findById(invoiceId);
      const old = JSON.stringify(invoice)
      const inv = JSON.parse(old)
      if (!invoice) throw new Error("Invoice not found");

      if (role !== "SUPERADMIN" && String(inv?.DentistID) !== id) {
        throw new Error("Unauthorized");
      }
      console.log({ inv })
      return { ...inv, id: inv._id };
    },
    getInvoiceByPatientID: async (_, { patientId }, { req }) => {
      const { id, role } = await verifyToken(req);

      const invoices = await InvoiceModel.find({ PatientID: patientId });

      if (!invoices || invoices.length === 0) {
        throw new Error("No invoices found for this patient");
      }

      // If the requester is not an admin, ensure they are the dentist assigned
      if (role !== "SUPERADMIN") {
        const unauthorized = invoices.some(
          (invoice) => String(invoice.DentistID) !== id
        );

        if (unauthorized) throw new Error("Unauthorized");
      }

      return invoices;
    },

  },

  Mutation: {
    async createCustomInvoice(_: any, { input }: { input: any }) {
      const invoice = await InvoiceModel.create({
        ...input,
        isCustom: true,
        type: "Custom"
      });
      return invoice.populate("dentistId", "firstName lastName");
    },

    async assignInvoiceToDentist(
      _: any,
      { invoiceId, dentistId }: { invoiceId: string; dentistId: string }
    ) {
      const dentistExists = await UserModel.exists({ _id: dentistId });
      if (!dentistExists) throw new Error("Dentiste introuvable.");

      const invoice = await InvoiceModel.findByIdAndUpdate(
        invoiceId,
        { DentistID: dentistId, status: "En_cours" },
        { new: true }
      )
      if (!invoice) throw new Error("Facture introuvable.");
      return invoice;
    },
    updateInvoice: async (_, { input }, { req }) => {
      const { id: userId, role } = await verifyToken(req);
      const { id, ...updates } = input;

      const invoice = await InvoiceModel.findById(id);
      if (!invoice) throw new Error("Invoice not found");

      if (role !== "SUPERADMIN" && String(invoice.PatientID) !== userId) {
        throw new Error("Unauthorized");
      }

      return await InvoiceModel.findByIdAndUpdate(id, updates, { new: true });
    },

    deleteInvoice: async (_, { id: invoiceId }, { req }) => {
      const { id: userId, role } = await verifyToken(req);

      const invoice = await InvoiceModel.findById(invoiceId);
      if (!invoice) throw new Error("Invoice not found");

      if (role !== "SUPERADMIN" && String(invoice.PatientID) !== userId) {
        throw new Error("Unauthorized");
      }

      await InvoiceModel.findByIdAndDelete(invoiceId);
      return true;
    },

    createInvoice: async (_, { input }, { req }) => {
      const { id: userId } = await verifyToken(req);

      const invoiceData = {
        ...input,
        DentistID: userId,
        PatientID: input.patientID,
        aligners: input.aligners || [],
        object: input.object || "",
      };

      return await new InvoiceModel(invoiceData).save();
    },
  },

  Invoice: {
    // patientID: async (input, _, { Loaders }) => {
    //   const patientID = input.patientID;
    //   return (await patientID) ? await Loaders.patients.load(patientID) : null;
    // },

    patientID: async ({ patientID }, _, { Loaders }) => {
      return (await patientID) ? await Loaders.patients.load(patientID) : null;
    },
    PatientID: async (data, _, { Loaders }) => {
      // const { PatientID } = data;
      console.log({ data })
      return (await data.PatientID) ? await Loaders.patients.load(data.PatientID) : data.PatientID;
    },
    dentistID: async (input, _, { Loaders }) => {
      const dentistID = input.DentistID;
      return (await dentistID) ? await Loaders.user.load(dentistID) : null;
    },
  },
};
