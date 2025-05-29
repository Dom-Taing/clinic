import { createSupaClient } from "@/service/supa";
import { createInvoicePdf, createPrescriptionPdf } from "@/utils/createPdf";
import { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";
import path from "path";

const accountants = {
  // "94aed8fe-7c58-4890-b99f-dcf4c389153a": {
  //   id: "e3f447ea-301d-48eb-8c2f-9037781aa711",
  //   created_at: "2024-05-10T06:13:02.679349+00:00",
  //   name: "Kunthea",
  //   role: "accountant",
  //   name_kh: "គន្ធា​",
  //   clinic: "94aed8fe-7c58-4890-b99f-dcf4c389153a",
  // },
  "94aed8fe-7c58-4890-b99f-dcf4c389153a": {
    id: "f0338caa-ed3e-4c76-8f36-4e75aaa76c1a",
    created_at: "2024-05-10T06:13:02.679349+00:00",
    name: "Kimhak",
    role: "accountant",
    name_kh: "",
    clinic: "94aed8fe-7c58-4890-b99f-dcf4c389153a",
  },
  "5bfd930d-4c71-4723-b051-79ce11bf67a4": {
    id: "fef424d3-6ed9-4a45-8405-a7539982f3ad",
    created_at: "2024-06-01T06:50:34.542899+00:00",
    name: "Man Theary",
    role: "accountant",
    name_kh: null,
    clinic: "5bfd930d-4c71-4723-b051-79ce11bf67a4",
  },
  "f7e24ce6-ac51-4012-91d7-295bd51ce128": {
    id: "6b68c883-d5e1-44d5-90b7-5485379ffd5c",
    created_at: "2024-06-02T07:23:28.065008+00:00",
    name: "Baen Alisa",
    role: "accountant",
    name_kh: "ប៉ែន អេលីសា",
    clinic: "f7e24ce6-ac51-4012-91d7-295bd51ce128",
  },
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

  const {
    clinic,
    diagnosis,
    doctor,
    accountant = accountants[clinic.id as keyof typeof accountants],
    name,
    age,
    sex,
    prescription,
    date,
  } = req.body;

  const supabase = createSupaClient();
  var recordId;
  try {
    const createdRecord = await supabase
      .from("Record")
      .insert({
        diagnosis: diagnosis,
        doctor: doctor?.id,
        accountant: accountant?.id,
        patient_name: name,
        patient_age: age,
        patient_sex: sex,
        prescription: prescription,
        clinic: clinic?.id,
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

  await createPrescriptionPdf(doc, "kh", clinic, {
    prescription: prescription.filter(
      (prescription: any) =>
        prescription.addInto === "prescription" ||
        prescription.addInto === "both"
    ),
    name: name,
    sex: sex,
    age: age,
    diagnosis: diagnosis,
    date: date,
    doctor: doctor,
  });
  doc.addPage({ margin: 24, size: "A5" });

  await createInvoicePdf(doc, "kh", clinic, {
    name: name,
    sex: sex,
    age: age,
    date: date,
    invoiceNo: recordId,
    prescription: prescription.filter(
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
