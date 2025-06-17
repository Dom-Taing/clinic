import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import ReportForm from "@/components/ReportForm";
import { getCookieValue } from "@/utils/parseCookie";
import { GetServerSideProps } from "next";
import { createSupaClient } from "@/service/supa";
import ReportFormTest from "@/components/ReportForm/reportForm";
const inter = Inter({ subsets: ["latin"] });

interface ReportProps {
  doctorList: { id: string; name: string }[];
  clinic: string;
}

export default function Report({ doctorList, clinic }: ReportProps) {
  return (
    <main className={`${styles.main} ${inter.className}`}>
      {/* <ReportForm doctorList={doctorList.map((entry) => entry.name)} /> */}
      <ReportFormTest doctorList={doctorList} clinic={clinic} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<ReportProps> = async (
  context
) => {
  try {
    const clinicPlus = getCookieValue(context.req.headers.cookie, "clinicPlus");
    if (clinicPlus !== "ClinicPlus2025!") {
      return {
        redirect: {
          destination: `/password?redirect=${context.resolvedUrl}`,
          permanent: false,
        },
      };
    }
    const { clinic } = context.params as { clinic: string };
    const supabase = createSupaClient();

    let { data: Clinic } = await supabase
      .from("Clinic")
      .select("*")
      .eq("name", clinic);
    if (!Clinic?.length) {
      return { redirect: { destination: "/", permanent: false } };
    }

    let { data: User } = await supabase
      .from("User")
      .select("*")
      .eq("clinic", Clinic[0].id);
    const doctor = User?.filter((user) => user.role === "doctor");

    return {
      props: {
        doctorList: doctor || [],
        clinic,
      },
    };
  } catch {
    return {
      props: {
        doctorList: [],
        clinic: "",
      },
    };
  }
};
