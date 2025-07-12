import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { toZonedTime, format } from "date-fns-tz";
import { formatWorkTimeData } from "@/utils/workTime/formatWorkTime";
import { convertToTimeZone } from "@/utils/workTime/convertToTimeZone";
import { WorkTime } from "@/types/workTime";

// Initialize Supabase client with the Service Role Key
const supabase = createClient(
  process.env.SUPA_URL || "",
  process.env.SUPA_KEY || "" // Use the Service Role Key
);

export const calculateDuration = (
  startTime: string,
  endTime: string
): string => {
  const start = new Date(startTime); // Convert start time to Date object
  const end = new Date(endTime); // Convert end time to Date object

  const durationMs = end.getTime() - start.getTime(); // Calculate the difference in milliseconds

  if (durationMs < 0) {
    return "Invalid time range"; // Handle cases where endTime is earlier than startTime
  }

  const hours = Math.floor(durationMs / (1000 * 60 * 60)); // Convert to hours
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60)); // Convert to minutes
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000); // Convert to seconds

  return `${hours}h ${minutes}m ${seconds}s`; // Return the duration as a formatted string
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const timeZone = "Asia/Bangkok";
    const minusHours = 7; // Number of hours to subtract for ICT time adjustment

    // Get current ICT time
    const nowUTC = new Date(); // Current UTC time
    const nowICT = new Date(nowUTC.getTime() + minusHours * 60 * 60 * 1000);

    // Get yesterday's ICT date
    const yesterdayICT = new Date(
      Date.UTC(
        nowICT.getFullYear(),
        nowICT.getMonth(),
        nowICT.getDate() - 1,
        24 - minusHours
      )
    );
    const todayICT = new Date(
      Date.UTC(
        nowICT.getFullYear(),
        nowICT.getMonth(),
        nowICT.getDate(),
        24 - minusHours
      )
    );

    const { data, error } = await supabase
      .from("work_time") // Replace with your table name
      .select("*, User (id, name_kh, clinic)")
      .gte("time", yesterdayICT.toISOString())
      .lte("time", todayICT.toISOString()); // Filter for entries within the last 24 hours;

    const clinicIds = Array.from(
      new Set(
        (data || []).map((workTime) => workTime.User.clinic).filter(Boolean)
      )
    );
    const { data: telegramData, error: telegramError } = await supabase
      .from("telegram_groups")
      .select("*")
      .eq("function", "work_time")
      .in("clinic_id", clinicIds);

    const clinicWorkTimeMap: Record<string, WorkTime[]> = {};
    data?.forEach((workTime) => {
      const clinicId = workTime.User.clinic;
      if (!clinicWorkTimeMap[clinicId]) {
        clinicWorkTimeMap[clinicId] = [];
      }
      clinicWorkTimeMap[clinicId].push(workTime);
    });

    const formattedClinicWorkTime = Object.entries(clinicWorkTimeMap).map(
      ([clinicId, workTimes]) => ({
        clinicId,
        workTimes: formatWorkTimeData(workTimes),
      })
    );

    if (error || telegramError) {
      console.error("Error querying database:", error || telegramError);
      return res.status(500).json({ error: "Error querying database" });
    }

    const telegramBotToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    await Promise.all(
      formattedClinicWorkTime.map(async (clinicWorkTime) => {
        const clinicId = clinicWorkTime.clinicId;
        const telegramGroup = telegramData?.find(
          (group) => group.clinic_id === clinicId
        ).group_code;
        if (telegramGroup) {
          const summaryMessage = clinicWorkTime.workTimes
            .map(
              (entry) =>
                `Doctor: ${entry.userName}\nTime: ${convertToTimeZone(
                  entry.checkIn,
                  timeZone
                )}-${convertToTimeZone(entry.checkOut, timeZone)}\nDuration: ${
                  entry.duration || "N/A"
                }\nType: ${entry.type}\n`
            )
            .join("\n");
          await axios.post(telegramApiUrl, {
            chat_id: telegramGroup,
            text: `Daily Summary:\n\n${summaryMessage}`,
            parse_mode: "Markdown", // Optional: Use Markdown for formatting
          });
        }
      })
    );

    // Optionally, send the summary via email or log it elsewhere
    return res.status(200).json({
      message: "Daily summary generated successfully",
      data: formattedClinicWorkTime,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
