import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import MedicalForm from "@/components/MedicalForm";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { createSupaClient } from "@/service/supa";
import { clinic } from "@/types/common";
import { getCookieValue } from "@/utils/parseCookie";

const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  medicineList: { id: string; medicine: string; price: number }[];
  diagnosisList: { id: string; name: string }[];
  doctorList: { id: string; name: string }[];
  accountantList: { id: string; name: string }[];
  usageList: { id: string; usage: string }[];
  clinic: clinic;
}

// scan: rouch rol, nov sol

export default function Home({
  medicineList,
  diagnosisList,
  doctorList,
  accountantList,
  usageList,
  clinic,
}: HomeProps) {
  console.log(accountantList);
  return (
    <>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>{clinic.name}</h1>
        <MedicalForm
          medicineList={medicineList}
          diagnosisList={diagnosisList}
          doctorList={doctorList}
          accountantList={accountantList}
          usageList={usageList}
          clinic={clinic}
        />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
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

    let { data: Medicine } = await supabase
      .from("Medicine")
      .select("*")
      .order("medicine")
      .eq("clinic", Clinic[0].id);
    let { data: Diagnosis } = await supabase
      .from("Sickness")
      .select("*")
      .eq("clinic", process.env.SOKSAN_ID);
    let { data: User } = await supabase
      .from("User")
      .select("*")
      .eq("clinic", Clinic[0].id);
    let { data: Usage } = await supabase
      .from("Usage")
      .select("*")
      .order("sort");
    const doctor = User?.filter((user) => user.role === "doctor");
    const accountant = User?.filter((user) => user.role === "accountant");

    return {
      props: {
        medicineList: Medicine || [],
        diagnosisList: Diagnosis || [],
        doctorList: doctor || [],
        accountantList: accountant || [],
        usageList: Usage || [],
        clinic: Clinic[0],
      },
    };
  } catch {
    return {
      props: {
        medicineList: [],
        diagnosisList: [],
        doctorList: [],
        accountantList: [],
        usageList: [],
        clinic: null,
      },
    };
  }
};
