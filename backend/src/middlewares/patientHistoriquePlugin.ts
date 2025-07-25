//--------------------------------------------------------------
// utils/patientHistoriquePlugin.ts
//--------------------------------------------------------------
import { Schema } from "mongoose";
import { HistoriqueModel } from "../models";


/*───────────────────────────────────────────────────────────*/
/* 1. Événements uniques : on ne les loguera qu’une seule fois */
/*    (ici on les met tous, ajuste si tu veux autoriser les    */
/*    doublons pour certaines entrées).                        */
/*───────────────────────────────────────────────────────────*/
export const UNIQUE_EVENTS: any[] = [
    "DOSSIER_PATIENT_CREE",
    "PHOTOS_AJOUTEES",
    "SCANNER_AJOUTE",
    "RADIO_AJOUTEE",
    "PRESCRIPTION_REALISEE",
    "PRESCRIPTION_FINALISEE",
    "PROPOSITION_TRAITEMENT_SOUMISE",
    "PROPOSITION_TRAITEMENT_VALIDEE",
    "ALIGNEURS_EN_COURS_FABRICATION",
    "ALIGNEURS_PRETS",
    "ALIGNEURS_LIVRES",
    "DEMANDE_FINITION_TRAITEMENT",
    "FINITION_PROPOSEE",
    "FINITION_VALIDEE",
    "ALIGNEURS_FINITION_EN_COURS_FABRICATION",
    "ALIGNEURS_FINITION_PRETS",
    "ALIGNEURS_FINITION_LIVRES",
    "CONTENTION_DEMANDEE",
    "CONTENTION_EN_COURS_FABRICATION",
    "CONTENTION_PRETE",
    "CONTENTION_LIVREE",
    "TRAITEMENT_FINALISE",
];

/*───────────────────────────────────────────────────────────*/
/* 2. Helper pour insérer (ou upserter) un historique         */
/*───────────────────────────────────────────────────────────*/
async function logEvent(
    patientId: any,
    event: any,
    details = "",
    createdBy?: any,
) {
    if (UNIQUE_EVENTS.includes(event)) {
        // upsert : crée si absent
        await HistoriqueModel.updateOne(
            { patientId, event },
            {
                $setOnInsert: {
                    details,
                    createdBy,
                    timestamp: new Date(),
                },
            },
            { upsert: true },
        );
    } else {
        await HistoriqueModel.create({
            patientId,
            event,
            details,
            createdBy,
        });
    }
}

/*───────────────────────────────────────────────────────────*/
/* 3. Détection des changements → liste d’événements          */
/*    (complète les règles métier ici)                        */
/*───────────────────────────────────────────────────────────*/
function detectEvents(oldDoc: any, newDoc: any): { ev: any; dt?: string }[] {
    const evs: { ev: any; dt?: string }[] = [];

    /* Photos */
    if ((newDoc.photos?.length ?? 0) > (oldDoc.photos?.length ?? 0))
        evs.push({ ev: "PHOTOS_AJOUTEES" });

    /* Scanner STL */
    if ((newDoc.scanStlUrls?.length ?? 0) > (oldDoc.scanStlUrls?.length ?? 0))
        evs.push({ ev: "SCANNER_AJOUTE" });

    /* Radios */
    if ((newDoc.radioUrls?.length ?? 0) > (oldDoc.radioUrls?.length ?? 0))
        evs.push({ ev: "RADIO_AJOUTEE" });

    /* Prescription envoyée depuis le cabinet */
    if (!oldDoc.creationFormule && newDoc.creationFormule)
        evs.push({ ev: "PRESCRIPTION_REALISEE" });

    /* Prescription validée par le BO */
    if (!oldDoc.isBoVerifyIt && newDoc.isBoVerifyIt)
        evs.push({ ev: "PRESCRIPTION_FINALISEE" });

    /* Proposition de traitement déposée (première insertion de phases) */
    if (
        (oldDoc.treatmentPhases?.length ?? 0) === 0 &&
        (newDoc.treatmentPhases?.length ?? 0) > 0
    )
        // evs.push({ ev: "PROPOSITION_TRAITEMENT_SOUMISE" });

    /* Validation de la proposition (ex. prix renseignés) */
    if (
        (oldDoc.treatmentPhases?.some((p: any) => p.price) ?? false) === false &&
        newDoc.treatmentPhases?.some((p: any) => p.price)
    )
        evs.push({ ev: "PROPOSITION_TRAITEMENT_VALIDEE" });

    /* Aligneurs en fabrication (stock créé) */
    if (
        (oldDoc.treatmentPhases?.some((p: any) => (p.stock ?? 0) > 0) ?? false) ===
        false &&
        newDoc.treatmentPhases?.some((p: any) => (p.stock ?? 0) > 0)
    )
        evs.push({ ev: "ALIGNEURS_EN_COURS_FABRICATION" });

    /* Stock complet → aligneurs prêts (zéro stock ↦ livré ensuite) */
    const oldStock = oldDoc.treatmentPhases?.reduce(
        (s: number, p: any) => s + (p.stock ?? 0),
        0,
    );
    const newStock = newDoc.treatmentPhases?.reduce(
        (s: number, p: any) => s + (p.stock ?? 0),
        0,
    );
    if (oldStock > 0 && newStock === 0)
        evs.push({ ev: "ALIGNEURS_PRETS" });

    /* etc. Ajoute ici DEMANDE_FINITION_TRAITEMENT, CONTENTION_… */

    return evs;
}

/*───────────────────────────────────────────────────────────*/
/* 4. Plugin global à brancher sur PatientSchema             */
/*───────────────────────────────────────────────────────────*/
export function patientHistoriquePlugin(
    schema: Schema<any>,          // ← on accepte n’importe quel modèle
    _opts?: any,                  // (optionnel) options jamais utilisées ici
): void {
    /* a. Création du dossier patient -------------------------- */
    schema.pre("save", function (next) {
        (this as any)._wasNew = this.isNew;
        next();
    });

    schema.pre("save", async function (next) {
        // stocke l'état initial pour comparaison post-save
        if (!this.isNew) {
            (this as any).__orig = await this.constructor.findById(this._id);
        }
        next();
    });

    schema.post("save", async function (doc: any) {
        if (doc._wasNew) {
            await logEvent(doc._id, "DOSSIER_PATIENT_CREE");
        } else {
            const oldDoc = doc.__orig ?? {};
            const evs = detectEvents(oldDoc, doc.toObject());
            if (evs.length)
                await Promise.all(evs.map(e => logEvent(doc._id, e.ev, e.dt)));
        }
    });

    /* b. Updates atomiques (findOneAndUpdate / updateOne …) ---- */
    schema.pre(
        ["findOneAndUpdate", "updateOne", "updateMany"],
        async function (next) {
            const upd: any = this.getUpdate() ?? {};
            const oldDoc = await this.model.findOne(this.getQuery()).lean();
            if (!oldDoc) return next();

            const merged = { ...oldDoc, ...(upd.$set ?? {}), ...upd };
            const evs = detectEvents(oldDoc, merged);
            if (evs.length) {
                const by = (this as any).options?._createdBy;
                await Promise.all(evs.map(e => logEvent(oldDoc._id, e.ev, e.dt, by)));
            }
            next();
        },
    );
}
