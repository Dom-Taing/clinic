import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { toZonedTime, format } from "date-fns-tz";

// Initialize Supabase client with the Service Role Key
const supabase = createClient(
  process.env.SUPA_URL || "",
  process.env.SUPA_KEY || "" // Use the Service Role Key
);

interface WorkTime {
  id: number;
  created_at: string; // ISO 8601 timestamp
  user_id: string; // UUID
  time: string; // ISO 8601 timestamp
  type: "check_in" | "check_out"; // Enum for type
}

interface User {
  id: string; // UUID
  name_kh: string; // Khmer name
}

interface FormattedWorkTime {
  userId: string;
  checkIn: string | null; // ISO 8601 timestamp or null if no check-in
  checkOut: string | null; // ISO 8601 timestamp or null if no check-out
  duration: string; // Duration in "Xh Ym Zs" format
}

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

export const convertToICT = (isoString: string): string => {
  const timeZone = "Asia/Bangkok"; // ICT timezone
  const zonedTime = toZonedTime(isoString, timeZone); // Convert UTC to ICT
  return format(zonedTime, "HH:mm:ss", { timeZone }); // Format the time in ICT
};

const formatData = (data: WorkTime[], userData: User[]) => {
  let formattedData: FormattedWorkTime[] = [];
  data.forEach((item) => {
    const existingItemIndex = formattedData.findIndex(
      (d) => d.userId === item.user_id
    );
    if (existingItemIndex !== -1) {
      if (item.type === "check_in") {
        formattedData[existingItemIndex].checkIn = convertToICT(item.time);
      } else if (item.type === "check_out") {
        formattedData[existingItemIndex].checkOut = convertToICT(item.time);
      }
    } else {
      formattedData.push({
        userId:
          userData.find((user) => user.id === item.user_id)?.name_kh || "",
        checkIn: item.type === "check_in" ? convertToICT(item.time) : null,
        checkOut: item.type === "check_out" ? convertToICT(item.time) : null,
        duration: "N/A", // Duration will be calculated later
      });
    }
  });
  formattedData = formattedData.map((entry) => {
    const checkIn = entry.checkIn || "N/A";
    const checkOut = entry.checkOut || "N/A";
    const duration =
      entry.checkIn && entry.checkOut
        ? calculateDuration(entry.checkIn, entry.checkOut)
        : "N/A";
    return {
      ...entry,
      checkIn,
      checkOut,
      duration,
    };
  });
  return formattedData;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Query the database
    const now = new Date(); // Current date and time
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    const { data, error } = await supabase
      .from("work_time") // Replace with your table name
      .select("*")
      .gte("time", twentyFourHoursAgo.toISOString()); // Filter for entries within the last 24 hours;

    const { data: userData, error: userError } = await supabase
      .from("User") // Replace with your actual table name
      .select("id, name_kh") // Select all columns or specify the columns you need
      .in("id", data?.map((entry) => entry.user_id) || []); // Filter for IDs in the provided array

    if (error || userError) {
      console.error("Error querying database:", error || userError);
      return res.status(500).json({ error: "Error querying database" });
    }

    // Generate the summary (example: log the data or process it)
    const formattedData = formatData(data as WorkTime[], userData);

    const summaryMessage = formattedData
      .map(
        (entry) =>
          `Doctor: ${entry.userId}\nTime: ${entry.checkIn}-${entry.checkOut}\nDuration: ${entry.duration}\n`
      )
      .join("\n");

    // Send the summary to Telegram
    const telegramBotToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.ADMIN_CHAT_ID; // Add your chat ID here
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
