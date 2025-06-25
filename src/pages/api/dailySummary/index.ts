import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { toZonedTime, format } from "date-fns-tz";
import { formatWorkTimeData } from "@/utils/workTime/formatWorkTime";
import { convertToTimeZone } from "@/utils/workTime/convertToTimeZone";

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

    // Get current ICT time
    const nowUTC = new Date(); // Current UTC time
    const nowICT = toZonedTime(nowUTC, timeZone); // Convert UTC to ICT

    // Get yesterday's ICT date
    const yesterdayICT = new Date(nowICT);
    yesterdayICT.setDate(yesterdayICT.getDate() - 1); // Subtract one day
    yesterdayICT.setHours(0, 0, 0, 0); // Set to midnight

    // Convert ICT times to UTC for querying the database
    const yesterdayUTC = format(yesterdayICT, "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: "UTC",
    });
    const nowUTCString = format(nowICT, "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: "UTC",
    });

    // const now = new Date(); // Current date and time
    // const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    const { data, error } = await supabase
      .from("work_time") // Replace with your table name
      .select("*")
      .gte("time", yesterdayUTC)
      .lte("time", nowUTCString); // Filter for entries within the last 24 hours;

    const { data: userData, error: userError } = await supabase
      .from("User") // Replace with your actual table name
      .select("id, name_kh") // Select all columns or specify the columns you need
      .in("id", data?.map((entry) => entry.user_id) || []); // Filter for IDs in the provided array

    const formattedData = formatWorkTimeData(data || [], userData || []);

    if (error || userError) {
      console.error("Error querying database:", error || userError);
      return res.status(500).json({ error: "Error querying database" });
    }

    const summaryMessage = formattedData
      .map(
        (entry) =>
          `Doctor: ${entry.userName}\nTime: ${convertToTimeZone(
            entry.checkIn,
            timeZone
          )}-${convertToTimeZone(entry.checkOut, timeZone)}\nDuration: ${
            entry.duration || "N/A"
          }\n`
      )
      .join("\n");

    // Send the summary to Telegram
    const telegramBotToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.NEXT_SOKSAN_WORKTIME_CHAT_ID; // Add your chat ID here
    const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    await axios.post(telegramApiUrl, {
      chat_id: telegramChatId,
      text: `Daily Summary:\n\n${summaryMessage}`,
      parse_mode: "Markdown", // Optional: Use Markdown for formatting
    });

    // Optionally, send the summary via email or log it elsewhere
    return res.status(200).json({
      message: "Daily summary generated successfully",
      data: formattedData,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
