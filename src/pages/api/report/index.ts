import { createSupaClient } from "@/service/supa";
import { createInvoicePdf, createPrescriptionPdf } from "@/utils/createPdf";
import { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";
import path from "path";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { form } = req.body;
};
