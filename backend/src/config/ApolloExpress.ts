import { ApolloServer } from "apollo-server-express";
import http from "http";
import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import DataLoader from "dataloader";
import { resolvers, typeDefs } from "../controllers";
import {
  notFound,
  BatchUsers,
  BatchPatients,
  BatchVideos,

} from "../middlewares";
import { InvoiceModel } from "../models";

// import PDFDocument from "pdfkit";
// import moment from "moment";
// import numeral from "numeral";
// import writtenNumber from "written-number";

const path = require("path");
const PDFDocument = require("pdfkit");
const moment = require("moment");
const numeral = require("numeral");
const writtenNumber = require("written-number");

writtenNumber.defaults.lang = "fr"; // pour la somme en toutes lettres

/* --------------------------------------------------------------------------- */
/*                            COULEURS & RESSOURCES                            */
/* --------------------------------------------------------------------------- */
const C = {
  teal: "#35B0BA",  // fond bleu clair YourSmile
  tealDark: "#256572",  // titres + tableau
  gray: "#555555",  // texte principal
  grayLine: "#BFBFBF",  // traits tableau
  yellow: "#FFF200",  // surlignage ref / valeurs
};

const FONT_REGULAR = {
  normal: "Helvetica",        // police standard PDFKit
  bold:   "Helvetica-Bold",
};

const dh = (v) => numeral(v).format("0,0.00") + " DH";





const { PORT, MONGO_URI } = process.env;

const app = express();

const startServer = async (app: Application) => {
  //? Middlewares
  app.use(express.json());
  app.use("/public", express.static(path.join(process.cwd(), "public")));
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true, // enable set cookie from server
    })
  );


  app.get("/hello", (_: Request, res: Response) => {
    res.json({
      message: "hello ❤",
    });
  });




  app.get("/:id/download", async (req, res) => {
    const invoice: any = await InvoiceModel.findById(req.params.id)
      .populate("DentistID", "firstName lastName email phone")
      .populate("PatientID", "nom prenom");

    if (!invoice) return res.status(404).send("Invoice not found");

    /* ------------------------------ Prépare réponse ----------------------------- */
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=facture_${invoice.id}.pdf`
    );

    const doc = new PDFDocument({ size: "A4", margin: 0, bufferPages: true });
    doc.pipe(res);

    /* ------------------------------------------------------------------------- */
    /*                                 ENTÊTE                                    */
    /* ------------------------------------------------------------------------- */
    // Bandeau supérieur blanc (margin‑less PDF ⇒ on dessine tout en coordonnées réelles)
    const PAGE_W = 595; // A4 portrait, points (72 dpi)

    // Logo YourSmile
    try {
      const logoW = 230;
      doc.image(
        path.join(__dirname, "../../assets/logo_yoursmile.png"),
        50,
        40,
        { width: logoW }
      );
    } catch { }

    // Bloc « Facture / Ref / Date »
    const refX = PAGE_W - 130;
    doc
      .font(FONT_REGULAR.bold)
      .fontSize(18)
      .fillColor(C.gray)
      .text("Facture", refX, 40, { align: "left" });

    const refY0 = 70;
    doc.fontSize(11).font(FONT_REGULAR.bold);

    // labels
    doc.fillColor(C.gray).text("Ref :", refX, refY0);
    doc.text("Date :", refX, refY0 + 15);

    // valeurs soulignées en jaune
    const valX = refX + 35;
    const writeVal = (txt, y) => {
      const w = doc.widthOfString(txt);
      const h = doc.currentLineHeight();
      doc.save().rect(valX - 2, y - 2, w + 4, h + 4).fill(C.yellow).restore();
      doc.fillColor(C.gray).text(txt, valX, y);
    };

    writeVal(invoice.id.toString().slice(-6).toUpperCase(), refY0); // last digits for readability
    writeVal(moment(invoice.createdAt).format("DD/MM/YYYY"), refY0 + 15);

    /* ------------------------------------------------------------------------- */
    /*                              EMETTEUR / DEST                              */
    /* ------------------------------------------------------------------------- */
    const boxY = 120;
    const boxH = 115;

    // Émetteur – rectangle teal
    doc.save().fillColor(C.teal).rect(50, boxY, 270, boxH).fill().restore();
    doc
      .font(FONT_REGULAR.bold)
      .fillColor("white")
      .fontSize(11)
      .text("MEMO Dental Services", 60, boxY + 10);

    doc
      .font(FONT_REGULAR.normal)
      .fontSize(10)
      .text("12 rue Ras Al Maa, CIL, Casablanca", 60, boxY + 30)
      .text("ICE 003665238000011", 60, boxY + 55)
      .text("RC 664731", 60, boxY + 70);

    // Adressé à – cadre ligne fine
    doc.save().lineWidth(1).strokeColor(C.grayLine).rect(340, boxY, 205, boxH).stroke().restore();

    doc
      .font(FONT_REGULAR.bold)
      .fillColor(C.gray)
      .fontSize(11)
      .text(`Dr. ${invoice.DentistID?.lastName ?? "—"}`, 350, boxY + 10);

    doc
      .font(FONT_REGULAR.normal)
      .fontSize(10)
      .text("Adresse :", 350, boxY + 30, { continued: true })
      .text("Oasis, Casablanca"); // -> adapter selon données

    /* ------------------------------------------------------------------------- */
    /*                                TABLEAU                                   */
    /* ------------------------------------------------------------------------- */
    const tblY0 = 255;
    const col = {
      des: 50,
      tva: 365,
      pu: 430,
      qte: 485,
      tot: 535,
    };
    const rowH = 22;

    // Entête tableau – texte + trait bas
    doc
      .font(FONT_REGULAR.bold)
      .fillColor(C.gray)
      .fontSize(10)
      .text("Désignation", col.des, tblY0)
      .text("TVA", col.tva, tblY0)
      .text("P.U. HT", col.pu, tblY0)
      .text("Qté", col.qte, tblY0)
      .text("Total HT", col.tot, tblY0);

    doc
      .moveTo(col.des, tblY0 + rowH - 6)
      .lineTo(col.tot + 50, tblY0 + rowH - 6)
      .strokeColor(C.grayLine)
      .stroke();

    /* -------- Ligne produit (1 seule ici, étendre par boucle si besoin) ------ */
    const lineY = tblY0 + rowH;
    doc.font(FONT_REGULAR.normal).fillColor(C.gray);

    doc.text(invoice.object ?? "Pack aligneurs", col.des, lineY, { width: col.tva - col.des - 10 });
    doc.text("20%", col.tva, lineY);
    doc.text(dh(invoice.amount), col.pu, lineY, { align: "right", width: col.qte - col.pu - 5 });
    doc.text("1", col.qte, lineY);
    doc.text(dh(invoice.amount), col.tot, lineY, { align: "right" });

    // trait bas tableau
    doc.moveTo(col.des, lineY + rowH - 6).lineTo(col.tot + 50, lineY + rowH - 6).stroke(C.grayLine);

    /* ------------------------------------------------------------------------- */
    /*                                   TOTAUX                                 */
    /* ------------------------------------------------------------------------- */
    const yTot = lineY + rowH + 15;
    const ht = invoice.amount;
    const tva = 0.2 * ht;
    const ttc = ht + tva;

    const label = (t, y, bold = true) => {
      doc.font(bold ? FONT_REGULAR.bold : FONT_REGULAR.normal)
        .fillColor(C.gray)
        .text(t, col.tva, y, { width: col.tot - col.tva - 5, align: "right" });
    };
    const val = (v, y, highlight = false) => {
      const txt = dh(v);
      const w = doc.widthOfString(txt);
      const h = doc.currentLineHeight();
      const x = col.tot + 5;
      if (highlight) {
        doc.save().fillColor(C.yellow).rect(x - 3, y - 2, w + 6, h + 4).fill().restore();
      }
      doc.fillColor(C.gray).font(FONT_REGULAR.bold).text(txt, x, y);
    };

    label("Total HT", yTot);
    val(ht, yTot, true);

    label("Total TVA 20%", yTot + 15);
    val(tva, yTot + 15);

    // Total TTC avec fond teal
    const ttcY = yTot + 30;
    const ttcTxt = dh(ttc);
    const ttcW = doc.widthOfString(ttcTxt);
    doc.save().fillColor(C.teal).rect(col.tva - 3, ttcY - 2, col.tot - col.tva + ttcW + 14, 20).fill().restore();
    label("Total TTC", ttcY, true);
    doc.fillColor("white").font(FONT_REGULAR.bold).text(ttcTxt, col.tot + 5, ttcY);

    /* Montant en lettres */
    const ttcInt = Math.round(ttc);
    doc
      .font(FONT_REGULAR.normal)
      .fillColor(C.gray)
      .fontSize(10)
      .text(
        `Arrêté la présente facture à la somme de : ${writtenNumber(ttcInt).toUpperCase()} DIRHAMS TTC.`,
        50,
        ttcY + 30,
        { width: 500 }
      );

    /* ------------------------------------------------------------------------- */
    /*                                   FOOTER                                 */
    /* ------------------------------------------------------------------------- */
    const footY = 740;

    doc.fontSize(8).fillColor(C.gray).text("Conditions de règlement : à date de réception de la facture", 50, footY);

    doc.text(
      "Règlement par chèque à l'ordre de MEMO Dental Services, ou par virement sur le compte bancaire suivant :\nBanque : CFG Bank\nNuméro de compte : 050780030011474793200167\nNom du propriétaire du compte : MEMO Dental Services",
      50,
      footY + 15
    );

    // Ligne séparatrice
    doc.moveTo(50, 810).lineTo(545, 810).strokeColor(C.grayLine).stroke();

    doc.fontSize(8).fillColor(C.gray).text(
      "MEMO Dental Services – Siège social : 12 rue Ras Al Maa, CIL, Casablanca  •  RC : 664731  •  IF : 66221963  •  ICE : 003665238000011",
      50,
      820,
      { width: 495, align: "center" }
    );

    /* ------------------------------------------------------------------------- */
    doc.end();
  });


  // app.get("/:id/download", async (req, res) => {
  //   const invoice: any = await InvoiceModel.findById(req.params.id)
  //     .populate("DentistID", "firstName lastName email phone")
  //     .populate("PatientID", "nom prenom");

  //   if (!invoice) return res.status(404).send("Invoice not found");

  //   /* ------------------------------------------------------------------ */
  //   /* ----   RÉGLAGES PDF  --------------------------------------------- */
  //   /* ------------------------------------------------------------------ */
  //   res.setHeader("Content-Type", "application/pdf");
  //   res.setHeader(
  //     "Content-Disposition",
  //     `attachment; filename=facture_${invoice.id}.pdf`
  //   );

  //   const doc = new PDFDocument({ size: "A4", margin: 40 });
  //   doc.pipe(res);

  //   const bleu = "#256572";
  //   const gris = "#555";
  //   const dh = (v: number) => numeral(v).format("0,0.00") + " DH";

  //   /* ------------------------------------------------------------------ */
  //   /* ----   ENTÊTE  ---------------------------------------------------- */
  //   /* ------------------------------------------------------------------ */
  //   // Logo (optionnel)
  //   try {
  //     doc.image(path.join(__dirname, "../../assets/logo.png"), 40, 40, { width: 80 });
  //   } catch { /* pas grave si le fichier manque */ }

  //   doc
  //     .fontSize(18)
  //     .fillColor(bleu)
  //     .text("LABO-ALIGNEUR", 130, 45);

  //   doc
  //     .fontSize(10)
  //     .fillColor(gris)
  //     .text("123, Rue de la Santé\nCasablanca 20250\ncontact@labo-aligneur.ma\n+212 5 22 00 00 00", 130, 70);

  //   doc
  //     .moveTo(40, 110)
  //     .lineTo(555, 110)
  //     .strokeColor(bleu)
  //     .lineWidth(1)
  //     .stroke();

  //   /* ------------------------------------------------------------------ */
  //   /* ----   INFO FACTURE  --------------------------------------------- */
  //   /* ------------------------------------------------------------------ */
  //   doc
  //     .fontSize(14)
  //     .fillColor(bleu)
  //     .text("FACTURE", 40, 125);

  //   doc
  //     .fontSize(10)
  //     .fillColor(gris)
  //     .text(`N° : ${invoice.id}`, 40, 145)
  //     .text(`Date : ${moment(invoice.createdAt).format("DD/MM/YYYY")}`);

  //   /* ------------------------------------------------------------------ */
  //   /* ----   ADRESSES  -------------------------------------------------- */
  //   /* ------------------------------------------------------------------ */
  //   const yAdr = 180;
  //   doc
  //     .fontSize(10)
  //     .fillColor(bleu)
  //     .text("Dentiste", 40, yAdr)
  //     .text("Patient", 310, yAdr);

  //   doc
  //     .fillColor(gris)
  //     .fontSize(10)
  //     .text(
  //       `${invoice.DentistID?.firstName ?? "—"} ${invoice.DentistID?.lastName ?? ""}\n${invoice.DentistID?.email ?? ""}\n${invoice.DentistID?.phone ?? ""}`,
  //       40,
  //       yAdr + 15
  //     )
  //     .text(
  //       `${invoice.PatientID?.prenom ?? ""} ${invoice.PatientID?.nom ?? ""}`,
  //       310,
  //       yAdr + 15
  //     );

  //   /* ------------------------------------------------------------------ */
  //   /* ----   TABLE  ----------------------------------------------------- */
  //   /* ------------------------------------------------------------------ */
  //   const yTable = 260;
  //   const colX = [40, 260, 340, 430, 515]; // X positions

  //   const drawRow = (y: number) => {
  //     doc
  //       .moveTo(colX[0], y)
  //       .lineTo(colX[4], y)
  //       .strokeColor("#ddd")
  //       .stroke();
  //   };

  //   // En-tête
  //   doc.fontSize(10).fillColor(bleu);
  //   ["Description", "Qté", "PU", "Montant"].forEach((t, i) => {
  //     const x = colX[i] + 2;
  //     doc.text(t, x, yTable, { width: colX[i + 1] - colX[i] - 4 });
  //   });
  //   drawRow(yTable + 15);

  //   // Ligne unique (ou boucler si plusieurs)
  //   const yLine = yTable + 25;
  //   doc.fillColor(gris);
  //   doc.text(invoice.object ?? "—", colX[0] + 2, yLine, { width: colX[1] - colX[0] - 4 });
  //   doc.text("1", colX[1] + 2, yLine);
  //   doc.text(dh(invoice.amount), colX[2] + 2, yLine, { width: colX[3] - colX[2] - 4, align: "right" });
  //   doc.text(dh(invoice.amount), colX[3] + 2, yLine, { width: colX[4] - colX[3] - 4, align: "right" });

  //   drawRow(yLine + 15);

  //   /* ------------------------------------------------------------------ */
  //   /* ----   TOTAUX  ---------------------------------------------------- */
  //   /* ------------------------------------------------------------------ */
  //   const yTot = yLine + 35;
  //   const tva = 0.2 * invoice.amount;
  //   const ttc = invoice.amount + tva;
  //   const ttcInt = Math.round(ttc);

  //   const label = (txt: string, y: number) =>
  //     doc
  //       .font("Helvetica-Bold")
  //       .fillColor(bleu)
  //       .text(txt, colX[2], y, { width: colX[3] - colX[2], align: "right" });

  //   const value = (val: string, y: number) =>
  //     doc
  //       .font("Helvetica")
  //       .fillColor(gris)
  //       .text(val, colX[3] + 2, y, { width: colX[4] - colX[3] - 4, align: "right" });

  //   label("Sous-total HT :", yTot);
  //   value(dh(invoice.amount), yTot);

  //   label("TVA 20 % :", yTot + 15);
  //   value(dh(tva), yTot + 15);

  //   label("Total TTC :", yTot + 30);
  //   value(dh(ttc), yTot + 30);

  //   /* Montant en lettres */
  //   doc
  //     .fontSize(10)
  //     .fillColor(bleu)
  //     .text(
  //       `Arrêté la présente facture à la somme de : ${writtenNumber(ttcInt, { lang: "fr" }).toUpperCase()} DIRHAMS TTC.`,
  //       40,
  //       yTot + 60,
  //       { width: 475 }
  //     );

  //   /* ------------------------------------------------------------------ */
  //   /* ----   FOOTER  ---------------------------------------------------- */
  //   /* ------------------------------------------------------------------ */
  //   doc
  //     .fontSize(8)
  //     .fillColor(gris)
  //     .text(
  //       "Merci de votre confiance. Règlement à réception. Pénalités de retard selon l’article L441-6 du Code de commerce.",
  //       40,
  //       760,
  //       { width: 515, align: "center" }
  //     );

  //   doc.end();
  // });


  const server = new ApolloServer({
    resolvers,
    typeDefs,
    playground: process.env.NODE_ENV == "development",
    introspection: process.env.NODE_ENV == "development",
    context: async ({ req }) => {
      return {
        Loaders: {
          user: new DataLoader((keys) => BatchUsers(keys)),
          patients: new DataLoader((keys) => BatchPatients(keys)),
          video: new DataLoader((keys) => BatchVideos(keys)),
        },
        //@ts-ignore
        req,
        // pubsub,
      };
    },
  });
  server.applyMiddleware({
    app,
    path: "/yourSmile",
  });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  //? 404 and error handling
  app.use(notFound);

  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      httpServer.listen(PORT || 5000);
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    })
    .catch((err: any) => {
      console.error(err);
    });
};

export { app, startServer };
