import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import EditTime from "@/components/editTime";
import { createSupaClient } from "@/service/supa";
import { GetServerSideProps } from "next";
import { formatWorkTimeData } from "@/utils/workTime/formatWorkTime";
import { FormattedWorkTime } from "@/types/workTime";
import { format, toZonedTime } from "date-fns-tz";

const inter = Inter({ subsets: ["latin"] });

interface EditTimePageProps {
  workTimeData: FormattedWorkTime[]; // Adjust type as needed
}

export default function EditTimePage({ workTimeData }: EditTimePageProps) {
  return (
    <main className={`${styles.main} ${inter.className}`}>
      <EditTime workTimeData={workTimeData} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<EditTimePageProps> = async (
  context
) => {
  try {
    const supabase = createSupaClient();

    // Define the ICT timezone
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
    console.log("Formatted Data:", formattedData);

    return {
      props: {
        workTimeData: formattedData, // Pass the formatted data to the page props
      },
    };
  } catch {
    return {
      props: {
        workTimeData: [],
      },
    };
  }
};
function utcToZonedTime(nowUTC: Date, timeZone: string) {
  throw new Error("Function not implemented.");
}
