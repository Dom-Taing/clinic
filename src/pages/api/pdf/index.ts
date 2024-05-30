import { createSupaClient } from "@/service/supa";
import { createInvoicePdf, createPrescriptionPdf } from "@/utils/createPdf";
import { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";
import path from "path";

const accountant = {
  id: "e3f447ea-301d-48eb-8c2f-9037781aa711",
  created_at: "2024-05-10T06:13:02.679349+00:00",
  name: "Kunthea",
  role: "accountant",
  name_kh: "គន្ធា​",
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // if (
  //   !(
  //     req.body.name &&
  //     req.body.sex &&
  //     req.body.age &&
  //     req.body.diagnosis &&
  //     req.body.prescription &&
  //     req.body.date &&
  //     req.body.doctor &&
  //     req.body.accountant
  //   )
  // ) {
  //   res.status(400).json({ error: "Invalid request body" });
  //   return;
  // }
  const supabase = createSupaClient();
  var recordId;
  try {
    const createdRecord = await supabase
      .from("Record")
      .insert({
        diagnosis: req.body.diagnosis,
        doctor: req.body.doctor?.id,
        accountant: req.body.accountant?.id,
        patient_name: req.body.name,
        patient_age: req.body.age,
        patient_sex: req.body.sex,
        prescription: req.body.prescription,
      })
      .select("*");
    recordId = createdRecord?.data?.[0].invoiceNo;
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  const doc = new PDFDocument({
    margins: {
      left: 45,
      right: 45,
      top: 22,
      bottom: 22,
    },
    size: "A5",
  });
  doc.pipe(res);
  doc.registerFont("Khmer", path.resolve("./public/Khmer-Regular.ttf"));
  doc.registerFont("Fancy-Khmer", path.resolve("./public/Moul-Regular.ttf"));
  await createPrescriptionPdf(doc, "kh", {
    prescription: req.body.prescription.filter(
      (prescription: any) =>
        prescription.addInto === "prescription" ||
        prescription.addInto === "both"
    ),
    name: req.body.name,
    sex: req.body.sex,
    age: req.body.age,
    diagnosis: req.body.diagnosis,
    date: req.body.date,
    doctor: req.body.doctor,
  });
  doc.addPage({ margin: 24, size: "A5" });

  await createInvoicePdf(doc, "kh", {
    name: req.body.name,
    sex: req.body.sex,
    age: req.body.age,
    date: req.body.date,
    invoiceNo: recordId,
    prescription: req.body.prescription.filter(
      (prescription: any) =>
        prescription.addInto === "invoice" || prescription.addInto === "both"
    ),
    accountant: accountant,
  });

  // doc.font("Khmer").text("ឈ្មោះ").moveDown(0.5);
  // doc.font("Times-Roman").text("Hello from Times Roman!").moveDown(0.5);
  doc.end();
  res.setHeader("Content-Disposition", "attachment; filename=generated.pdf");
  res.setHeader("Content-Type", "application/pdf");
};
