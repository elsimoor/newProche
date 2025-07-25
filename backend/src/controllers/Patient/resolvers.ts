import { Types } from "mongoose";
import { verifyToken } from "../../middlewares";
import { AlignerModel, InvoiceModel, OrderModel, PatientModel, TransactionModel, UserModel } from "../../models";
import { PatientDoc } from "../../models/PatientModel";
import { computePatientStatus } from "../../middlewares/patientStatus";



interface StockRow {
  dentistId: Types.ObjectId;
  number: number;
  price?: number;
  stock: number;
}


const stockPipeline = (match: Record<string, any> = {}) => [
  { $match: match },

  { $unwind: "$treatmentPhases" },

  {
    $project: {
      dentistId: "$dentistId",
      number: "$treatmentPhases.step",
      price: "$treatmentPhases.price",
      stock: { $ifNull: ["$treatmentPhases.stock", 0] }
    }
  },

  {
    $group: {
      _id: { dentistId: "$dentistId", number: "$number" },
      price: { $first: "$price" },
      stock: { $sum: "$stock" }
    }
  },

  {
    $project: {
      _id: 0,
      dentistId: "$_id.dentistId",
      number: "$_id.number",
      price: 1,
      stock: 1
    }
  }
];
export const patientResolvers = {
  Query: {
    getAllOrders: async (_: any, { statuses }: { statuses?: string[] }) => {


      const filter: any = {};
      if (statuses?.length) filter.status = { $in: statuses };
      return OrderModel.find(filter)
        .sort({ createdAt: -1 })
    },

    boAlignerStock: async (_: any, __: any) => {


      const rows = await PatientModel.aggregate<StockRow>(stockPipeline());

      return rows.map(row => ({
        ...row,
        dentist: row.dentistId
      }));
    },

    boAlignerStockByDentist: async (_: any, { dentistId }) => {

      const match = { dentistId: new Types.ObjectId(dentistId) };
      const rows = await PatientModel.aggregate<StockRow>(stockPipeline(match));

      return rows.map(row => ({
        ...row,
        dentist: row.dentistId
      }));
    },

    boDashboardStats: async (_: any, __: any) => {

      const [
        totalPatients,
        patientsPending,
        totalDentists,
        alignerStock,
      ] = await Promise.all([
        PatientModel.estimatedDocumentCount(),
        PatientModel.countDocuments({ isBoVerifyIt: false }),
        UserModel.countDocuments({ role: "ADMIN" }),
        PatientModel.aggregate([
          ...stockPipeline(),
          { $group: { _id: null, total: { $sum: "$stock" } } }
        ]),
      ]);

      return {
        totalPatients,
        patientsPending,
        totalDentists,
        totalAlignersInStock: alignerStock[0]?.total ?? 0,
      };
    },
    patientAlignerHistory: async (_: any, { patientId }) => {
      const patient: any = await PatientModel.findById(patientId).lean();
      if (!patient) throw new Error("Patient not found");

      const events = (patient.treatmentPhases ?? [])
        .flatMap((ph: any) => ph.events?.map((e: any) => ({
          label: e.label,
          date: e.date,
        })) ?? []);

      return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    patientAdvance: async (_: any, { id }: { id: string }) => {
      const p: any = await PatientModel.findById(id).lean()
      if (!p) throw new Error("Patient not found")

      const upper: any[] = []
      const lower: any[] = []
      const UPPER_SET = new Set([18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28])

      const pushStatus = (n: number, status: number) =>
        (UPPER_SET.has(n) ? upper : lower).push({ number: n, status })

        ; (p.fixedTeeth ?? []).forEach(n => pushStatus(n, 1))
        ; (p.iprTeeth ?? []).forEach(n => pushStatus(n, 2))

      const movements = (p.treatmentPhases ?? []).flatMap((ph: any) =>
        (ph.iprPairs ?? []).map((pair: any) => ({
          tooth: pair.teeth[0],
          start: ph.step,
          end: ph.step,
        }))
      )

      const activeAligners = (p.treatmentPhases ?? [])
        .filter((ph: any) => (ph.stock ?? 0) > 0)
        .map((ph: any) => ph.step)

      return {
        patientName: `${p.prenom ?? ""} ${p.nom ?? ""}`.trim(),
        currentAligner: p.currentAligner ?? 1,
        activeAligners,
        teeth: { upper, lower },
        movements,
      }
    },
    patientTransactions: (_, { patientId }) =>
      TransactionModel.find({ patientId }).sort({ createdAt: -1 }),

    dentistStats: async (_, { dentistId }) => {
      const agg = await TransactionModel.aggregate([
        { $match: { dentistId: new Types.ObjectId(dentistId) } },
        {
          $group: {
            _id: null,
            invoices: { $sum: { $cond: [{ $eq: ["$type", "INVOICE"] }, "$amount", 0] } },
            payments: { $sum: { $cond: [{ $eq: ["$type", "PAYMENT"] }, "$amount", 0] } },
          }
        },
        {
          $project: {
            _id: 0,
            totalInvoices: "$invoices",
            totalPayments: "$payments",
            balance: { $add: ["$invoices", "$payments"] }
          }
        }
      ])
      return agg[0] ?? { totalInvoices: 0, totalPayments: 0, balance: 0 }
    },
    dentistsWithPatients: async () => {
      const dentists = await UserModel.find({ role: "ADMIN" })
      return dentists
    },
    patients: () => PatientModel.find(),
    patient: async (
      _: unknown,
      { id }: { id: string }
    ) => {
      try {

        const patient = await PatientModel.findById(id);
        return patient;
      } catch (error) {
        console.error("Error fetching patient:", error);
        throw new Error(error.message || "Failed to fetch patient");
      }
    },

    // patientsByDentistId: async (
    //   _: unknown,
    //   __: unknown,
    //   { req }
    // ) => {
    //   const { id } = await verifyToken(req);
    //   const patients = await PatientModel.find({ dentistId: id }).lean({ virtuals: true }).sort({ _id: -1 });
    //   return patients;
    // }

    patientsByDentistId: async (_, __, { req }) => {
      const { id } = await verifyToken(req);

      /* 1️⃣ requête */
      const patients: any = await PatientModel
        .find({ dentistId: id })
        .sort({ _id: -1 })                  // tri d'abord
        .lean({ virtuals: true }) as Array<PatientDoc & { computedStatus?: string }>;
      /* 2️⃣ (optionnel) –– si tu préfères écraser status ici même   */
      const result = [];
      for (const p of patients) {
        let status = await computePatientStatus(p);
        result.push({
          ...p,
          id: p._id.toString(),
          status
        });
      }
      return result;

    }
    ,
    boPatientsPending: async (_: any, __: any) => {
      return PatientModel.find({ isBoVerifyIt: false });
    },
    boPatient: async (_: any, { id }: { id: string }) => {
      return PatientModel.findById(id);
    },
    patientOrders: async (
      _: unknown,
      { patientId, statuses }: { patientId: string; statuses?: string[] },
      { req },
    ) => {
      const { id } = await verifyToken(req)
      const filter: any = { patientId, dentistId: id }
      if (statuses?.length) filter.status = { $in: statuses }
      return OrderModel.find(filter).sort({ createdAt: -1 })
    },
    alignersByDentist: async (_, { dentistId }: { dentistId: any }) => {
      console.log('dentistId', dentistId)
      if (typeof dentistId !== "string") {
        throw new Error("dentistId doit être une chaîne")
      }
      return AlignerModel.find({ dentistId }).sort({ number: 1 })
    },

    aligner: (_, { id }: { id: string }) => AlignerModel.findById(id),
    getPatientSetup3d: async (_: any, { patientId }: { patientId: string }) => {
      const patient: any = await PatientModel.findById(patientId);
      if (!patient) throw new Error("Patient not found");
      return patient
    }

  },

  Mutation: {

    async deleteAudioInstruction(
      _: unknown,
      { id, url }: { id: string; url: string }  // <- or { id, index }
    ) {
      // 1. Pull the URL (or the array element at `index`) out of MongoDB
      const patient = await PatientModel.findByIdAndUpdate(
        id,
        { $pull: { audioInstructions: url } },      // by URL
        // {$unset: { [`audioInstructions.${index}`]: 1 }}  // by index
        { new: true }
      );
      if (!patient) throw new Error("Patient not found");

      return patient;
    },
    isTretmentFinaliseByBo: async (
      _: any,
      { patientId, TretmentFinalise }: { patientId: string; TretmentFinalise: boolean }
    ) => {
      const patient: any = await PatientModel.findById(patientId);
      if (!patient) throw new Error("Patient not found");
      patient.TretmentFinalise = TretmentFinalise;
      await patient.save();
      return patient;
    },
    isDentistShowMsgForApatient: async (
      _: any,
      { patientId, isDentistShowMsg }: { patientId: string; isDentistShowMsg: boolean }
    ) => {
      const patient: any = await PatientModel.findById(patientId);
      if (!patient) throw new Error("Patient not found");
      patient.isDentistShowMsg = isDentistShowMsg;
      await patient.save();
      return patient;
    },
    isSetupPaidByDentist: async (
      _: any,
      { patientId, isSetupPaid }: { patientId: string; isSetupPaid: boolean }
    ) => {
      const patient: any = await PatientModel.findById(patientId);
      if (!patient) throw new Error("Patient not found");
      patient.isSetupPaid = isSetupPaid;
      await patient.save();
      return patient;
    },
    isAlignersPaidByDentist: async (
      _: any,
      { patientId, isAlignersPaid }: { patientId: string; isAlignersPaid: boolean }
    ) => {
      const patient: any = await PatientModel.findById(patientId);
      if (!patient) throw new Error("Patient not found");
      patient.isAlignersPaid = isAlignersPaid;
      await patient.save();
      return patient;
    },
    isPatientArchived: async (
      _: any,
      { patientId, isArchived }: { patientId: string; isArchived: boolean }
    ) => {
      const patient: any = await PatientModel.findById(patientId);
      if (!patient) throw new Error("Patient not found");
      patient.isArchived = isArchived;
      await patient.save();
      return patient;
    },
    updatePatientStatusisValideDentist: async (
      _: any,
      { input }: { input: { patientId: string; isValideDentist?: boolean } }
    ) => {
      const { patientId, isValideDentist } = input;
      const patient: any = await PatientModel.findById(patientId);
      if (!patient) throw new Error("Patient not found");
      patient.isValideDentist = isValideDentist;
      // nowCanSeeEverything

      if (patient.isValideDentist && patient.isvalideYS && !patient.joEcouleEnd) {
        patient.joEcouleEnd = new Date()
      }

      await patient.save();
      return patient;
    },
    // updatePatientStatusisvalideYS: async (
    //   _: any,
    //   { input }: { input: { patientId: string; isvalideYS?: boolean; } }
    // ) => {
    //   const { patientId, isvalideYS } = input;
    //   const patient: any = await PatientModel.findById(patientId);
    //   if (!patient) throw new Error("Patient not found");
    //   patient.isvalideYS = isvalideYS;

    //   await patient.save();
    //   return patient;
    // },

    // ───────────────────────── 1. Valider côté dentiste ─────────────────────────
    updateIsVlideSetupComplet: async (
      _: any,
      { patientId, isVlideSetupComplet }: { patientId: string; isVlideSetupComplet?: boolean }
    ) => {
      const patient: any = await PatientModel.findById(patientId)
      if (!patient) throw new Error("Patient not found")
      // on met à jour uniquement si le booléen est fourni
      patient.isVlideSetupComplet = isVlideSetupComplet

      await patient.save()
      return patient
    }
    ,
    addAlignersTotalPrice: async (
      _: any,
      { patientId, aligersTotalPrice }: any
    ) => {
      const patient: any = await PatientModel.findById(patientId)
      if (!patient) throw new Error("Patient not found")

      // on met à jour uniquement si le prix est fourni
      patient.aligersTotalPrice = aligersTotalPrice

      await patient.save()
      return patient
    }
    ,
    updatePatientStatusisvalideYS: async (
      _: any,
      { input }: { input: { patientId: string; isvalideYS?: boolean } }
    ) => {
      const { patientId, isvalideYS } = input
      const patient: any = await PatientModel.findById(patientId)
      if (!patient) throw new Error("Patient not found")

      if (typeof isvalideYS === "boolean") {
        patient.isvalideYS = isvalideYS
      }

      await patient.save()
      return patient
    },
    deleteImageFromPatient: async (
      _: any,
      { patientId, imageType, imageUrl }: { patientId: string; imageType: string; imageUrl: string }
    ) => {
      const patient: any = await PatientModel.findById(patientId);
      if (!patient) throw new Error("Patient not found");

      const images = patient[imageType] || [];
      const index = images.indexOf(imageUrl);
      if (index > -1) {
        images.splice(index, 1);
        patient[imageType] = images;
        await patient.save();
      } else {
        throw new Error("Image not found in patient's record");
      }

      return patient;
    },
    updatePatientSetup3d: async (
      _: any,
      { input }: any
    ) => {
      try {
        const { patientId, setup3d, nimoTeck3dLink } = input;
        console.log("input", input)
        const patient: any = await PatientModel.findById(patientId);
        console.log("setup3d", setup3d)
        if (!patient) throw new Error("Patient not found");
        patient.setup3d = setup3d;
        patient.nimoTeck3dLink = nimoTeck3dLink;
        await patient.save();
        return patient;
      } catch (error) {
        console.log("Error updating patient setup3d:", error);
        throw new Error(error.message || "Failed to update patient setup3d");
      }
    }
    , deleteOrder: async (_: any, { input: { id } }: { input: { id: string } }) => {
      try {
        const order = await OrderModel.deleteOne({ _id: id });
        return order.ok
      } catch (err) {
        return err
      }
    }
    , resetOrderStatuses: async (_: any, { input: { id } }: { input: { id: string } }) => {
      try {
        const order = await OrderModel.findOneAndUpdate({ _id: id }, {
          $set: {
            alignersHistory: []
          }
        });
        return { ...order, alignersHistory: [] }
      } catch (err) {
        return err
      }
    }
    , markAsCanceled: async (_: any, { input: { id, note, motif } }: { input: { id: string, note: string, motif: string } }) => {
      try {
        const order = await OrderModel.findOneAndUpdate({ _id: id }, {
          $set: {
            status: "CANCELED",
            note,
            motif
          }
        });
        return order;
      } catch (err) {
        return err
      }
    }

    , updateOrderStatusOfAligner: async (
      _: any,
      {
        input: { id, status, alignersHistory }
      }: {
        input: {
          id: string
          status?: string
          alignersHistory?: {
            number: number
            arcade: string
            statuses: {
              impression?: boolean
              thermoformage?: boolean
              decoupe?: boolean
              packaging?: boolean
            }
          }[]
        }
      }
    ) => {
      const order = await OrderModel.findById(id);
      if (!order) throw new Error("Order not found");

      // Mise à jour du statut global si fourni
      if (status) {
        order.status = status.toUpperCase() as any;
      }

      // Mise à jour de l'historique des aligneurs
      if (alignersHistory && Array.isArray(alignersHistory)) {
        // Initialiser s'il n'existe pas
        order.alignersHistory = order.alignersHistory || [];

        for (const newAligner of alignersHistory) {
          const existing = order.alignersHistory.find(
            (item: any) =>
              item.number === newAligner.number && item.arcade === newAligner.arcade
          );

          if (existing) {
            // Mise à jour des statuts spécifiques fournis
            existing.statuses = {
              ...existing.statuses,
              ...newAligner.statuses
            };
          } else {
            // Ajout d’un nouvel aligneur avec des statuts par défaut
            order.alignersHistory.push({
              number: newAligner.number,
              // @ts-ignore
              arcade: newAligner.arcade,
              statuses: {
                impression: false,
                thermoformage: false,
                decoupe: false,
                packaging: false,
                ...newAligner.statuses
              }
            });
          }
        }
      }

      await order.save();
      return order;
    }
    ,
    updateOrderStatus: async (
      _: any,
      {
        input: { id, status, alignersHistory }
      }: {
        input: {
          id: string
          status?: string
          alignersHistory?: {
            number: number
            arcade: string
            statuses: {
              impression?: boolean
              thermoformage?: boolean
              decoupe?: boolean
              packaging?: boolean
            }
          }[]
        }
      }
    ) => {
      const order = await OrderModel.findById(id);
      if (!order) throw new Error("Order not found");

      if (status) {
        order.status = status.toUpperCase() as any;
      }

      if (alignersHistory && Array.isArray(alignersHistory)) {
        order.alignersHistory = order.alignersHistory || [];

        alignersHistory.forEach((newAligner) => {
          const existing = order.alignersHistory.find(
            (item: any) =>
              item.number === newAligner.number && item.arcade === newAligner.arcade
          );

          if (existing) {
            Object.keys(newAligner.statuses).forEach((key) => {
              existing.statuses[key] = newAligner.statuses[key];
            });
          } else {
            order.alignersHistory.push({
              number: newAligner.number,
              arcade: newAligner.arcade as any,
              statuses: {
                impression: false,
                thermoformage: false,
                decoupe: false,
                packaging: false,
                ...newAligner.statuses
              }
            });
          }
        });
      }

      await order.save();
      return order;
    },
    setPatientAligners: async (_, { patientId, aligners }) => {

      const patient: any = await PatientModel.findById(patientId)
      if (!patient) throw new Error("Patient not found")


      await patient.save()

      await TransactionModel.insertMany(
        aligners.map(a => ({
          patientId,
          dentistId: patient.dentistId,
          type: "INVOICE",
          description: `Aligneur ${a.number}`,
          amount: a.price,
        }))
      )
      return patient
    },

    addTransaction: async (_, { patientId, type, description, amount }) => {
      const patient = await PatientModel.findById(patientId)
      if (!patient) throw new Error("Patient not found")


      return TransactionModel.create({
        patientId,
        dentistId: patient.dentistId,
        type,
        description,
        amount: type === "PAYMENT" ? -Math.abs(amount) : Math.abs(amount),
      })
    },
    updatePatientAligners: async (
      _: any,
      { patientId, aligners }: any,
    ) => {

      return PatientModel.findByIdAndUpdate(
        patientId,
        { aligners },
        { new: true },
      )
    },
    createAligner: async (_,
      { dentistId, input }: { dentistId: string; input: any },
    ) => {
      return AlignerModel.create({ dentistId, ...input })
    },

    updateAligner: async (_,
      { id, input }: { id: string; input: any },
    ) => {
      return AlignerModel.findByIdAndUpdate(id, input, { new: true })
    },

    deleteAligner: async (_,
      { id }: { id: string },
    ) => {
      const res = await AlignerModel.deleteOne({ _id: id })
      return res.deletedCount === 1
    },
    orderNextAligners: async (
      _: unknown,
      { patientId, alignerNumbers, deliveryDate, instructions, express = false }: {
        patientId: string; alignerNumbers: number[]; deliveryDate?: Date;
        instructions?: string; express?: boolean
      },
      { req }: any,
    ) => {
      try {
        const { id: dentistId } = await verifyToken(req)

        if (!alignerNumbers.length) throw new Error("Aucun aligneur sélectionné")

        const patient: any = await PatientModel.findById(patientId)

        console.log("patient", patient)
        if (!patient) throw new Error("Patient introuvable")

        let total = express ? 200 : 0
        for (const n of alignerNumbers.map(Number)) {          // ← s’assurer que n est bien un nombre
          const ph = patient.treatmentPhases.find(
            (p: any) => Number(p.step) == n                  // ← comparaison numérique
          );
          if (!ph) throw new Error(`Aligneur #${n} introuvable`);
          if ((ph.stock ?? 0) <= 0) throw new Error(`Plus de stock pour #${n}`);
          total += ph.price ?? 0;
        }
        // await patient.save()




        patient.isAligersDemand = true; // Marquer que la demande d'aligneurs a été faite

        await patient.save()

        const order = await OrderModel.create({
          patientId, dentistId, alignerNumbers,
          deliveryDate, instructions, express, total,
        })



        const now = new Date();
        alignerNumbers.forEach(n => {
          const ph = patient.treatmentPhases.find(p => p.step === n);
          if (!ph) return;
          ph.events ??= [];
          ph.events.push({ label: `Aligneur ${n} livré`, date: now });
        });
        await patient.save();

        await PatientModel.findOneAndUpdate(
          { _id: patientId, dentistId },
          { currentAligner: Math.max(...alignerNumbers) },
        )


        let objectLabel = ""
        if (alignerNumbers.length === 1) {
          objectLabel = `Aligneur ${alignerNumbers[0]}`
        } else if (alignerNumbers.length > 1) {
          const sortedAligners = [...alignerNumbers].sort((a, b) => a - b)
          objectLabel = `Aligneurs ${sortedAligners[0]} à ${sortedAligners[sortedAligners.length - 1]}`
        }

        const invoiceData = {
          amount: patient.aligersTotalPrice ?? total,
          status: "Regle",
          type: "Aligneurs",
          DentistID: dentistId,
          PatientID: patientId,
          aligners: alignerNumbers,
          object: objectLabel
        };

        await new InvoiceModel(invoiceData).save();


        return order
      } catch (error) {
        console.error("Error ordering next aligners:", error);
        throw new Error(error.message || "Failed to order next aligners");
      }
    },
    boUpsertTreatmentPhases: async (_, { patientId, phases }, { req }) => {
      /* 1. Auth */
      const { id: boId } = await verifyToken(req);

      /* 2. Patient */
      const patient: any = await PatientModel.findById(patientId);
      if (!patient) throw new Error("Patient not found");

      /* 3. Phase pré-traitement */
      const sortedPhases = [...phases].sort((a, b) => a.step - b.step);

      /* 3-bis. On calcule l’union une seule fois */
      const allAttachments = new Set<number>();
      sortedPhases.forEach((ph) =>
        (ph.attachmentTeeth ?? []).forEach((t: number) =>
          allAttachments.add(t),
        ),
      );
      const unionArray = Array.from(allAttachments);

      const newPhases = sortedPhases.map((raw) => ({
        ...raw,
        stock: 1,
        attachmentTeeth: unionArray,          // ⇦ même liste pour chaque phase
      }));

      /* 4. Mise à jour patient */
      patient.treatmentPhases = newPhases;
      patient.attachmentTeeth = unionArray;   // racine = même union
      patient.missingTeeth = newPhases[0].missingTeeth || [];   // <-- NEW

      patient.boUpdatedBy = boId;
      await patient.save();

      /* 5. Upsert aligneurs */
      await Promise.all(
        newPhases.map((ph: any) =>
          AlignerModel.findOneAndUpdate(
            { dentistId: patient.dentistId, number: ph.step },
            { label: `Aligneur ${ph.step}`, price: ph.price, stock: 1 },
            { upsert: true, new: true },
          ),
        ),
      );

      return patient;
    },


    boToggleValidation: async (_: Tfparam, { patientId, validated }: { patientId: string, validated: boolean }) => {
      try {
        let patient = await PatientModel.findById(patientId);
        if (validated) {
          patient.joEcouleStart = new Date()
        } else {
          patient.joEcouleStart = null
        }

        await patient.save();

        return patient;
      } catch (error) {
        console.error("Error toggling validation:", error);
        throw new Error(error.message || "Failed to toggle validation");
      }
    },
    boToggleValidationAligners: async (_: any, { patientId }: any) => {
      try {
        let patient = await PatientModel.findById(patientId);
        // patient.joEcouleStart = new Date()
        patient.isBoVerifyIt = true


        await patient.save();

        return patient;
      } catch (error) {
        console.error("Error toggling validation:", error);
        throw new Error(error.message || "Failed to toggle validation");
      }
    },

    updateDentistProgress: async (_: any, { patientId, aligner }: any, { req }: any) => {
      const { id } = await verifyToken(req)

      if (aligner < 1 || aligner > 16) throw new Error("Aligner out of bounds");

      return PatientModel.findOneAndUpdate(
        { _id: patientId, dentistId: id },
        { currentAligner: aligner },
        { new: true },
      );
    },
    UpdatePatient: async (_: any, { id, input }: { id: string; input: any }) => {
      const patient: any = await PatientModel.findByIdAndUpdate(
        id,
        input,
        { new: true, runValidators: true },
      );
      try {
        if (!patient) throw new Error("Patient introuvable");

        const fixed = input.fixedTeeth ?? patient.fixedTeeth ?? [];
        const actions = input.attachmentTeeth ?? patient.attachmentTeeth ?? [];

        if (!patient.treatmentPhases || patient.treatmentPhases.length === 0) {
          patient.treatmentPhases = [{
            step: 1,
            label: "Phase initiale",
            description: "Importée du formulaire du dentiste.",
            fixedTeeth: fixed,
            iprTeeth: [],
            actionTeeth: actions,
            iprPairs: [],
            events: [{ label: "Début du traitement", date: new Date() }],
            createdAt: new Date(),
            updatedAt: new Date(),
          }];
        } else {
          patient.treatmentPhases[0].fixedTeeth = fixed;
          patient.treatmentPhases[0].actionTeeth = actions;
          patient.treatmentPhases[0].updatedAt = new Date();
        }


        if (input.creationFormule) {

          const invoiceData = {
            amount: 2000,
            status: "Regle",
            type: "Setup",
            DentistID: patient.dentistId,
            PatientID: id,
            aligners: [],
            object: "Formule de création",
          };

          await new InvoiceModel(invoiceData).save();




        }

        await patient.save();
        return patient;
      } catch (error) {
        console.log("error", error.message)
        throw new Error(error.message || "Failed to update patient");
      }
    },
    UpdatePatientForMobile: async (_: any, { id, input }: { id: string; input: any }) => {
      try {
        console.log("input", input)
        console.log("id", id)

        const patient: any = await PatientModel.findByIdAndUpdate(
          id,
          input,
          { new: true, runValidators: true },
        );
        if (!patient) throw new Error("Patient introuvable");

        patient.audioInstructions = input.audioInstructions ?? patient.audioInstructions ?? [];



        await patient.save();
        return patient;
      } catch (error) {
        console.error("Error updating patient:", error);
        throw new Error(error.message || "Failed to update patient");
      }
    },


    createPatient: async (
      _: unknown,
      { input }: { input: any }
      , {
        req
      }
    ) => {
      const { id } = await verifyToken(req);

      const patient = new PatientModel({
        ...input,
        dentistId: id,
      });

      UserModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: id },
            update: { $push: { patients: patient._id } },
          },
        },
      ]);

      await patient.save();
      return patient;
    },

    deletePatient: async (_: unknown, { id }: { id: string }) => {
      const res = await PatientModel.deleteOne({ _id: id });
      return res.deletedCount === 1;
    },
  },
  Patient: {

    dentistId: async ({ dentistId }, _, { Loaders }) => {
      return (await dentistId) ? await Loaders.user.load(dentistId) : null;
    }
  },
  Aligner: {

    dentistId: async ({ dentistId }, _, { Loaders }) => {
      return (await dentistId) ? await Loaders.user.load(dentistId) : null;
    }
  },
  BOAlignerStock: {
    dentist: async ({ dentist }: any, _: any, { Loaders }) =>
      Loaders.user.load(dentist)
  },

  Order: {
    patientId: async ({ patientId }, _, { Loaders }) => {
      return (await patientId) ? await Loaders.patients.load(patientId) : null;
    },
    dentistId: async ({ dentistId }, _, { Loaders }) => {
      return (await dentistId) ? await Loaders.user.load(dentistId) : null;
    }
  },

};
interface Tfparam {
  _: any;
}