
import { OrderModel } from "../models";



/** ⚠️  Devient ASYNC car on interroge la collection Orders */
export async function computePatientStatus(p: any): Promise<string> {


  const validationsOK = p.isValideDentist && p.isvalideYS
  // const boOK = p.isBoVerifyIt === true;
  const setupOK = p?.nimoTeck3dLink?.trim() != "" && p?.nimoTeck3dLink?.startsWith("https://")

  const conditionsFinales = setupOK;
  /* On récupère la dernière (ou la seule) commande d’aligneurs du patient */
  const lastOrder = await OrderModel
    .findOne({ patientId: p._id })
    .sort({ createdAt: -1 })            // la plus récente
    .lean()
    .exec();   
    
    

    // doneOpenChatDentist && requireOpenChatBO
    // peut renvoyer null
  if (p.requireOpenChatBO  && !p.doneOpenChatDentist)
    return "Message à consulter";






  /* 1. Prescription à finaliser                                        */
  if (!p.creationFormule)
    return "Prescription à finaliser";

  /* 2. Paiement du setup                                               */
  if (!!p.creationFormule && !p.isSetupPaid)
    return "Setup à payer";


  if (p.isSetupPaid && !!p.creationFormule && !p.isvalideYS) {

    return "En cours de traitement par YourSmile";
  }


  if (p.isvalideYS && !p.isValideDentist && setupOK ) {
    return "Setup à valider";
  }

  // if (p.isvalideYS && p.isValideDentist && p?.nimoTeck3dLink?.trim() == "")
  //   return "Setup à valider";


  if (validationsOK && conditionsFinales && !p.isAligersDemand && !p.isBoVerifyIt) {
    return "Paramétrage du traitement en cours";
  }
  if (validationsOK && conditionsFinales && !p.isAligersDemand && p.isBoVerifyIt && !!p.aligersTotalPrice) {
    return "Commander les aligneurs";
  }



  if (lastOrder?.status == "PENDING") {
    return "Aligneurs en cours de production";
  }


  if (p.isAligersDemand && lastOrder?.status == "SHIPPED") {
    return "Aligneurs expédiés";
  }




  if (p.isAligersDemand && lastOrder?.status == "DELIVERED" && !p.TretmentFinalise) {
    return "Aligneur livré";
  }




  if (p.isAligersDemand && lastOrder?.status == "DELIVERED" && p.TretmentFinalise) {
    return "Traitement en cours";
  }









  return "Prescription à finaliser";
}



// /** Met à jour `patient.status` si nécessaire puis sauvegarde. */
// export async function refreshAndSaveStatus(patient: any) {
//   const newStatus = await computePatientStatus(patient);
//   if (newStatus !== patient.status) {
//     patient.status = newStatus;
//     await patient.save();
//   }
//   return patient;
// }
