import { createSupaClient } from "@/service/supa";
import { createInvoicePdf, createPrescriptionPdf } from "@/utils/createPdf";
import { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (
    !(
      req.body.name &&
      req.body.sex &&
      req.body.age &&
      req.body.diagnosis &&
      req.body.prescription &&
      req.body.date &&
      req.body.doctor &&
      req.body.accountant &&
      req.body.dob
    )
  ) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const supabase = createSupaClient();
  var recordId;
  try {
    const createdRecord = await supabase
      .from("Record")
      .insert({
        sickness: req.body.diagnosis.id,
        doctor: req.body.doctor.id,
        accountant: req.body.accountant.id,
        patient_name: req.body.name,
        patient_dob: req.body.dob,
        patient_sex: req.body.sex,
        prescription: req.body.prescription,
      })
      .select("*");
    recordId = createdRecord?.data[0].invoiceNo;
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
  doc.registerFont("Khmer", "public/Khmer-Regular.ttf");
  doc.registerFont("Fancy-Khmer", "public/Moul-Regular.ttf");
  await createPrescriptionPdf(doc, "kh", {
    prescription: req.body.prescription,
    name: req.body.name,
    sex: req.body.sex,
    age: req.body.age,
    diagnosis: req.body.diagnosis.name,
    date: req.body.date,
  });
  doc.addPage({ margin: 24, size: "A5" });

  await createInvoicePdf(doc, "kh", {
    name: req.body.name,
    sex: req.body.sex,
    age: req.body.age,
    date: req.body.date,
    invoiceNo: recordId,
    prescription: req.body.prescription,
  });

  // doc.font("Khmer").text("ឈ្មោះ").moveDown(0.5);
  // doc.font("Times-Roman").text("Hello from Times Roman!").moveDown(0.5);
  doc.end();
  res.setHeader("Content-Disposition", "attachment; filename=generated.pdf");
  res.setHeader("Content-Type", "application/pdf");
};
