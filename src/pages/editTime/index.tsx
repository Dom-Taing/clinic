import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import EditTime from "@/components/editTime";
import { createSupaClient } from "@/service/supa";
import { GetServerSideProps } from "next";
import { formatWorkTimeData } from "@/utils/workTime/formatWorkTime";
import { FormattedWorkTime } from "@/types/workTime";

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
