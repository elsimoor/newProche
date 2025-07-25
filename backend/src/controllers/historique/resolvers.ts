import { Types } from 'mongoose'; // For validating ObjectIds if necessary
import { HistoriqueEvent, HistoriqueModel, IHistorique } from '../../models/historique';

// interface CreateHistoriqueArgs {
//   input: {
//     patientId: string;
//     event: HistoriqueEvent;
//     details?: string;
//     createdBy?: string;
//   };
// }



interface HistoriqueArgs {
  id: string;
}

export const historiqueResolvers = {
  Query: {
    historiquesByPatient: async (_: any, { patientId }: any) => {
      if (!Types.ObjectId.isValid(patientId)) {
        throw new Error('Invalid Patient ID format');
      }
      try {
        const historiques = await HistoriqueModel.find({ patientId: patientId })
          .sort({ timestamp: -1 })
          .exec();
        return historiques;
      } catch (error) {
        console.error('Error fetching historiques by patient:', error);
        throw new Error('Failed to fetch historiques for the patient.');
      }
    },
    historique: async (_: any, { id }: HistoriqueArgs): Promise<IHistorique | null> => {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid Historique ID format');
      }
      try {
        const historiqueEntry = await HistoriqueModel.findById(id).exec();
        return historiqueEntry;
      } catch (error) {
        console.error('Error fetching historique by ID:', error);
        throw new Error('Failed to fetch historique entry.');
      }
    },
  },
  Mutation: {
    createHistorique: async (_: any, { input }: any): Promise<IHistorique> => {
      const { patientId, event, details, createdBy } = input;

      if (!Types.ObjectId.isValid(patientId)) {
        throw new Error('Invalid Patient ID format');
      }
      if (createdBy && !Types.ObjectId.isValid(createdBy)) {
        throw new Error('Invalid User ID format for createdBy');
      }


      if (!Object.values(HistoriqueEvent).includes(event)) {
        throw new Error(`Invalid event type: ${event}`);
      }

      const existingHistorique = await HistoriqueModel.findOne({
        patientId: patientId,
        event,
      });
      if (existingHistorique) {
        existingHistorique.timestamp = new Date(); // Update timestamp if entry already exists
        await existingHistorique.save(); // Save the updated entry
        return existingHistorique; // Return existing entry if it exists
      }
      // Create a new historique entry


      try {
        const newHistoriqueEntry = new HistoriqueModel({
          patientId: new Types.ObjectId(patientId),
          event,
          details,
          timestamp: new Date(),
          ...(createdBy && { createdBy: new Types.ObjectId(createdBy) }),
        });
        await newHistoriqueEntry.save();
        return newHistoriqueEntry;
      } catch (error) {
        console.error('Error creating historique entry:', error);

        throw new Error('Failed to create historique entry.');
      }
    },
  },
  // If you have related types (e.g., linking Historique to Patient or User),
  // you might need to add resolvers for those fields here.
  // For example, if your GraphQL Historique type has a 'patient: Patient' field:
  // Historique: {
  //   patient: async (parent: IHistorique) => {
  //     // Assuming you have a PatientModel
  //     // return await PatientModel.findById(parent.patientId);
  //     return { id: parent.patientId, name: "Fetch patient details here" }; // Placeholder
  //   },
  //   createdBy: async (parent: IHistorique) => {
  //     // Assuming you have a UserModel
  //     // if (!parent.createdBy) return null;
  //     // return await UserModel.findById(parent.createdBy);
  //      return parent.createdBy ? { id: parent.createdBy, name: "Fetch user details here" } : null; // Placeholder
  //   }
  // }
};

export default historiqueResolvers;
