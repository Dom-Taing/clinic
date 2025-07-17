import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize Supabase client with the Service Role Key
const supabase = createClient(
  process.env.SUPA_URL || "",
  process.env.SUPA_KEY || "" // Use the Service Role Key
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { entriesToInsert, reportData } = req.body;

    try {
      // Insert the entries into the table
      const { data, error } = await supabase
        .from("doctor_patient_counts")
        .insert(entriesToInsert);

      const { data: responseReport, error: reportError } = await supabase
        .from("daily_report")
        .insert(reportData);

      if (error) {
        console.error("Error inserting entries:", error);
        return res.status(400).json({ error: error.message });
      }

      if (reportError) {
        console.error("Error inserting entries:", reportError);
        return res.status(400).json({ error: reportError.message });
      }

      return res.status(200).json({ data });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
