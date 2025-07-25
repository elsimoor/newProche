import { Schema, Types, model } from "mongoose";
import { computePatientStatus } from "../middlewares/patientStatus";
import { patientHistoriquePlugin } from "../middlewares/patientHistoriquePlugin";

const ImageGroupSchema = new Schema(
    {
        profile: String,
        front: String,
        smile: String,
        upper: String,
        lower: String,
        face: String,
        open: String,
        side: String,
        left: String

    },
    { _id: false }
);


const IprPairSchema = new Schema(
    {
        teeth: { type: [Number], validate: (v: number[]) => v.length === 2 },
        amount: Number,
        jaw: { type: String, enum: ["upper", "lower"] },
    },
    { _id: false }
);


const PhaseEventSchema = new Schema(
    {
        label: { type: String, required: true },
        date: { type: Date, required: true },
    },
    { _id: false }
);

const TreatmentPhaseSchema = new Schema(
    {
        step: { type: Number, min: 1, max: 16, required: true }, // ex: 7
        label: String,
        description: String,
        fixedTeeth: [Number],
        iprTeeth: [Number],
        actionTeeth: [Number],
        iprPairs: [IprPairSchema],
        stock: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        events: [PhaseEventSchema],
        taquetTeeth: [Number],
        attachmentTeeth: [Number], // New field for attachment teeth
        missingTeeth: [Number]
    },
    { _id: false, timestamps: true }
);


// 👈 add once near the top if you prefer to re-use the same literals
const YES_NO = ["yes", "no"] as const;
const EXPANSION = ["expandAsMuchAsPossible", "expandSpecific"] as const;
const MIDLINE_ACT = ["maintain", "moveRight", "moveLeft", "center"] as const;
const IPR_ALLOW = ["none", "3mm", "5mm", "custom"] as const;
const CROSSBITE = ["yes", "no", "max"] as const;
const SPACES = ["distalize", "mesialize", "distalization", "close"] as const;
const REHAB = ["before", "after"] as const;
const OVERBITE = [
    "maintain", "improve", "extrudePosterior",
    "intrudeUpperAnterior", "intrudeLowerAnterior", "intrudeBothAnterior"
] as const;
const OPENBITE = [
    "maintain", "improve", "extrudeAnterior", "extrudePosterior",
    "extrudeUpperLowerAnterior", "extrudeAnteriorIntrudePosterior"
] as const;
const BITE_RISERS = YES_NO;
const CLASS_II_III = ["distalization", "elastics", "iprPosterior", "surgery", "none"] as const;
const MOLAR_CANINE = ["keep", "molar", "canine", "both"] as const;
const ROOT_SEGMENT = YES_NO;


export interface PatientDoc {
    type?: string
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    dateNaissance?: Date;
    genre?: "MALE" | "FEMALE" | "OTHER";
    notes?: string;
    isInternational?: boolean;
    indications?: string[];
    photos?: string[];
    dentistId?: string;

    imagesByType?: typeof ImageGroupSchema;
    cloudImagesByType?: typeof ImageGroupSchema;
    computerImagesByType?: typeof ImageGroupSchema;

    createdAt?: Date;
    joEcouleEnd?: Date;
    joEcouleStart?: Date;
    updatedAt?: Date;
    status?: string;
    creationFormule?: boolean;
    treatmentObjective?: string;
    selectedArch?: string;
    jointPieces?: string;
    placementTime?: string;
    fixedTeeth?: number[];
    attachmentTeeth?: number[];
    step2Notes?: string;
    scanStlUrls?: string[];
    isBoVerifyIt?: boolean;
    audioInstructions?: string[];
    missingTeeth?: number[];
    setup3d: [string];
    radioUrls?: string[];
    nimoTeck3dLink?: string; // New field for NimoTeck 3D link
    requireOpenChatBO?: boolean; // see down
    isDentistShowMsg?: boolean; // see down
    doneOpenChatDentist?: boolean; // see down
    isValideDentist?: boolean; // New field for dentist validation
    isvalideYS?: boolean; // New field for YS validation
    aligersTotalPrice?: string; // New field for aligners total price
    isVlideSetupComplet: boolean; // New field to check if setup is complete
    isAligersDemand?: boolean; // New field to check if aligners demand is made
    dateOfRegistration?: Date;
    patientName?: string;
    doctorName?: string;
    doctorEmail?: string;
    idNemoStudio?: string;
    recordsForPlanning?: string;

    expansionPreference?: (typeof EXPANSION)[number];
    expansionAmount?: number;
    upperMidlineMatchesLower?: (typeof YES_NO)[number];
    upperMidlineAction?: (typeof MIDLINE_ACT)[number];
    lowerMidlineAction?: (typeof MIDLINE_ACT)[number];
    iprAllowance?: (typeof IPR_ALLOW)[number];

    correctAnteriorCrossbite?: (typeof CROSSBITE)[number];
    correctPosteriorCrossbite?: (typeof CROSSBITE)[number];
    teethExtractionPrior?: (typeof YES_NO)[number];

    spacesAction?: (typeof SPACES)[number];
    rehabilitationTiming?: (typeof REHAB)[number];

    overbiteAction?: (typeof OVERBITE)[number];
    openbiteAction?: (typeof OPENBITE)[number];

    acceptBiteRisers?: (typeof BITE_RISERS)[number];
    classIIOrIIICorrection?: (typeof CLASS_II_III)[number][];   // checkbox → array
    molarCanineCorrection?: (typeof MOLAR_CANINE)[number];

    profileComplaints?: (typeof YES_NO)[number];
    agreeThirdMolarExtraction?: (typeof YES_NO)[number];
    rootSegmentation?: (typeof ROOT_SEGMENT)[number];

    indicationsForPlanning?: string;
    isArchived?: boolean
}

const PatientSchema = new Schema<PatientDoc>(
    {
        type: String,
        nom: String,
        dentistId: { type: Schema.Types.ObjectId, ref: "User" },
        prenom: String,
        email: { type: String, lowercase: true, trim: true, sparse: true },
        telephone: String,
        dateNaissance: Date,
        joEcouleStart: Date,
        joEcouleEnd: Date,
        genre: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },

        notes: String,
        isInternational: { type: Boolean, default: false },
        indications: [String],
        photos: [String],

        imagesByType: ImageGroupSchema,
        cloudImagesByType: ImageGroupSchema,
        computerImagesByType: ImageGroupSchema,
        status: {
            type: String,
            // enum: [
            //     "Prescription en cours",
            //     "Aligneurs à livrer",
            //     "Traitement en cours",
            //     "Demande refinement",
            //     "Prescription à finaliser",
            //     "Traitement finalisé",
            //     "En cours de planification"
            // ],
            default: "Prescription à finaliser"
        },
        creationFormule: { type: Boolean, default: false },
        treatmentObjective: { type: String },
        selectedArch: { type: String },
        jointPieces: { type: String },
        placementTime: { type: String },
        fixedTeeth: [Number],
        attachmentTeeth: [Number],
        step2Notes: { type: String },
        scanStlUrls: [String],
        isBoVerifyIt: { type: Boolean, default: false },
        treatmentPhases: [TreatmentPhaseSchema],
        currentAligner: { type: Number, default: 1 },

        boUpdatedBy: { type: Types.ObjectId, ref: "User" },
        audioInstructions: [String],
        missingTeeth: [Number],
        setup3d: [String],
        radioUrls: [String], // New field for radio URLs
        nimoTeck3dLink: { type: String, default: "" }, // New field for NimoTeck 3D link
        isValideDentist: { type: Boolean, default: false }, // New field for dentist validation
        requireOpenChatBO: { type: Boolean, default: false }, // this field is for required open the chat bubble so that the dentist must open it
        doneOpenChatDentist: { type: Boolean, default: false }, // If he done that things he can mark it as done by default false
        isDentistShowMsg: { type: Boolean, default: true }, // If he done that things he can mark it as done by default false
        isvalideYS: { type: Boolean, default: false }, // New field for
        aligersTotalPrice: { type: String, default: "" }, // New field for aligners total price
        isVlideSetupComplet: { type: Boolean, default: false }, // New field to check if setup is complete
        isAligersDemand: { type: Boolean, default: false }, // New field to check if aligners demand is made
        dateOfRegistration: Date,
        patientName: String,
        doctorName: String,
        doctorEmail: String,
        idNemoStudio: String,
        recordsForPlanning: String,

        expansionPreference: { type: String, enum: EXPANSION },
        expansionAmount: Number,
        upperMidlineMatchesLower: { type: String, enum: YES_NO },
        upperMidlineAction: { type: String, enum: MIDLINE_ACT },
        lowerMidlineAction: { type: String, enum: MIDLINE_ACT },
        iprAllowance: { type: String, enum: IPR_ALLOW },

        correctAnteriorCrossbite: { type: String, enum: CROSSBITE },
        correctPosteriorCrossbite: { type: String, enum: CROSSBITE },
        teethExtractionPrior: { type: String, enum: YES_NO },

        spacesAction: { type: String, enum: SPACES },
        rehabilitationTiming: { type: String, enum: REHAB },

        overbiteAction: { type: String, enum: OVERBITE },
        openbiteAction: { type: String, enum: OPENBITE },

        acceptBiteRisers: { type: String, enum: YES_NO },
        classIIOrIIICorrection: [{ type: String, enum: CLASS_II_III }],
        molarCanineCorrection: { type: String, enum: MOLAR_CANINE },

        profileComplaints: { type: String, enum: YES_NO },
        agreeThirdMolarExtraction: { type: String, enum: YES_NO },
        rootSegmentation: { type: String, enum: YES_NO },

        indicationsForPlanning: String,
        isArchived: { type: Boolean, default: false },


        isSetupPaid: { type: Boolean, default: false },   // ➜ payé (=true) ou en attente (=false)
        isAlignersShipped: { type: Boolean, default: false },   // aligners expédiés ?
        isAlignersPaid: { type: Boolean, default: false },   // facture aligners réglée ?
        TretmentFinalise: { type: Boolean, default: false }

    },
    { timestamps: true }
);


PatientSchema.index({ dentistId: 1, isBoVerifyIt: 1 });
PatientSchema.index({ "treatmentPhases.step": 1 });


/* …déclaration du schéma… */

PatientSchema.pre("save", async function (next) {
    // @ts-ignore
    this.status = await computePatientStatus(this as any);
    next();
});


// PatientSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], async function () {
//     // `this` is the query, not the doc. We need access to the update payload:
//     const update: any = this.getUpdate() ?? {};

//     // Load the current document to compute the future state
//     const docToBeUpdated: any = await this.model.findOne(this.getQuery());

//     if (docToBeUpdated) {
//         // simulate the merge of existing doc + incoming update
//         const merged = { ...docToBeUpdated.toObject(), ...update.$set, ...update };
//         update.$set ??= {};
//         update.$set.status = await computePatientStatus(merged);
//         this.setUpdate(update);
//     }
// });


PatientSchema.virtual("computedStatus").get(function () {
    return computePatientStatus(this as any);
});




PatientSchema.plugin(patientHistoriquePlugin);



export const PatientModel = model<PatientDoc>("Patient", PatientSchema);
