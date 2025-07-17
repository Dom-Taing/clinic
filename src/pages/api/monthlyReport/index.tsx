import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import axios from "axios";
import FormData from "form-data";

const supabase = createClient(
  process.env.SUPA_URL || "",
  process.env.SUPA_KEY || "" // Use the Service Role Key
);

type DoctorReport = {
  id: number;
  created_at: string; // ISO timestamp
  total_patient: number;
  night_patient: number;
  date: string; // "YYYY-MM-DD"
  doctor_name: string;
  user_id: string; // UUID
};

type DailyReport = {
  id: number;
  created_at: string; // ISO timestamp
  clinic_id: string;
  date: string;
  insuredPatient: number;
  insuredStayOver: number;
};

type FormattedMonthlyReport = {
  id: number | string;
  doctor_name: string;
  total_patient: number;
  night_patient: number;
  excess_patient: number;
  payment: number;
};

const formatDoctorData = (data: DoctorReport[]): FormattedMonthlyReport[] => {
  const basePatientNumber = 30;
  const aggregatedData = {
    total_patient: 0,
    night_patient: 0,
    excess_patient: 0,
    payment: 0,
  };
  const userMap = new Map<
    string,
    {
      doctor_name: string;
      total_patient: number;
      night_patient: number;
      excess_patient: number;
      payment: number;
    }
  >();

  data.forEach((item) => {
    if (!userMap.has(item.user_id)) {
      userMap.set(item.user_id, {
        doctor_name: item.doctor_name,
        total_patient: item.total_patient,
        night_patient: item.night_patient,
        excess_patient: Math.max(
          item.total_patient - item.night_patient - basePatientNumber,
          0
        ),
        payment:
          Math.max(
            item.total_patient - item.night_patient - basePatientNumber,
            0
          ) * 0.5,
      });
    } else {
      const agg = userMap.get(item.user_id)!;
      agg.total_patient += item.total_patient;
      agg.night_patient += item.night_patient;
      agg.excess_patient += Math.max(
        item.total_patient - item.night_patient - basePatientNumber,
        0
      );
      agg.payment +=
        Math.max(
          item.total_patient - item.night_patient - basePatientNumber,
          0
        ) * 0.5;
    }
  });

  userMap.forEach((item) => {
    aggregatedData.total_patient += item.total_patient;
    aggregatedData.night_patient += item.night_patient;
    aggregatedData.excess_patient += item.excess_patient;
    aggregatedData.payment += item.payment;
  });

  const formatArray: FormattedMonthlyReport[] = Array.from(
    userMap.values()
  ).map((item, index) => ({
    id: index + 1,
    ...item,
  }));
  formatArray.push({
    id: "Total",
    doctor_name: "",
    total_patient: aggregatedData.total_patient,
    night_patient: aggregatedData.night_patient,
    excess_patient: aggregatedData.excess_patient,
    payment: aggregatedData.payment,
  });
  return formatArray;
};

const toExcel = (data: FormattedMonthlyReport[]) => {
  // Convert to worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Report");

  // Auto-size columns
  const objectKeys = Object.keys(data[0] || {});
  worksheet["!cols"] = objectKeys.map((key) => {
    // Find the max length in this column (including the header)
    const maxLength = Math.max(
      key.length,
      ...data.map((row) =>
        row[key as keyof typeof row]
          ? String(row[key as keyof typeof row]).length
          : 0
      )
    );
    return { wch: maxLength + 2 }; // +2 for padding
  });

  // Write workbook to buffer
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return buffer;
};

const formatReportData = (data: DailyReport[]) => {
  return data.reduce(
    (agg, curr) => {
      agg.total_insured += curr.insuredPatient;
      agg.total_stay_over += curr.insuredStayOver;
      return { ...agg };
    },
    { total_insured: 0, total_stay_over: 0 }
  );
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);

      const isLastDayOfMonth = tomorrow.getDate() === 1;

      if (!isLastDayOfMonth) {
        return res
          .status(200)
          .json({ message: "Not the last day of the month, skipping job." });
      }
      const firstDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).toISOString();
      const firstDayNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      ).toISOString();

      const { data, error } = await supabase
        .from("doctor_patient_counts")
        .select("*")
        .gte("date", firstDay)
        .lt("date", firstDayNextMonth);
      const { data: reportData, error: reportError } = await supabase
        .from("daily_report")
        .select("*")
        .gte("date", firstDay)
        .lt("date", firstDayNextMonth);
      const { data: telegramData, error: telegramError } = await supabase
        .from("telegram_groups")
        .select("*")
        .eq("function", "monthly_report")
        .in("clinic_id", ["5bfd930d-4c71-4723-b051-79ce11bf67a4"]);

      if (error || reportError) {
        console.error("Error fetching data:", error || reportError);
        return res
          .status(500)
          .json({ error: "Failed to fetch monthly report" });
      }

      const formattedData = formatDoctorData(data);
      const buffer = toExcel(formattedData);

      const aggregatedReportData = formatReportData(reportData);

      const telegramBotToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      const chatId = telegramData?.find(
        (group) => group.clinic_id === "5bfd930d-4c71-4723-b051-79ce11bf67a4"
      ).group_code;

      const form = new FormData();
      form.append("chat_id", chatId);
      form.append("document", buffer, {
        filename: "monthly_report.xlsx",
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}`;

      try {
        await axios.post(`${telegramApiUrl}/sendDocument`, form, {
          headers: form.getHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        const summaryMessage = `Total បសស: ${aggregatedReportData.total_insured}\nTotal សំរាកពេទ្យ: ${aggregatedReportData.total_stay_over}`;
        await axios.post(`${telegramApiUrl}/sendMessage`, {
          chat_id: chatId,
          text: summaryMessage,
          parse_mode: "Markdown", // Optional: Use Markdown for formatting
        });
      } catch (err) {
        console.error("Failed to send file to Telegram:", err);
      }

      // Set headers for file download
      // res.setHeader(
      //   "Content-Disposition",
      //   "attachment; filename=monthly_report.xlsx"
      // );
      // res.setHeader(
      //   "Content-Type",
      //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      // );
      // res.status(200).send(buffer);
      res.status(200).send({ data: formattedData });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
