import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import MedicalForm from "@/components/MedicalForm";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { createSupaClient } from "@/service/supa";
import { createClient } from "@supabase/supabase-js";

const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  medicineList: { id: string; medicine: string; price: number }[];
  diagnosisList: { id: string; name: string }[];
  doctorList: { id: string; name: string }[];
  accountantList: { id: string; name: string }[];
  usageList: { id: string; usage: string }[];
}

export default function Home({
  medicineList,
  diagnosisList,
  doctorList,
  accountantList,
  usageList,
}: HomeProps) {
  const handleClick = async () => {
    const response = await axios.post("/api/pdf", {}, { responseType: "blob" });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "generated.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <MedicalForm
          medicineList={medicineList}
          diagnosisList={diagnosisList}
          doctorList={doctorList}
          accountantList={accountantList}
          usageList={usageList}
        />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  try {
    const supabase = createSupaClient();

    let { data: Medicine } = await supabase.from("Medicine").select("*");
    let { data: Diagnosis } = await supabase.from("Sickness").select("*");
    let { data: User } = await supabase.from("User").select("*");
    let { data: Usage } = await supabase.from("Usage").select("*");
    const doctor = User?.filter((user) => user.role === "doctor");
    const accountant = User?.filter((user) => user.role === "accountant");

    return {
      props: {
        medicineList: Medicine || [
          { medicine: "Paracetamol", price: 0.1 },
          { medicine: "Ibuprofen", price: 0.2 },
          { medicine: "Aspirin", price: 0.3 },
        ],
        diagnosisList: Diagnosis || ["Headache", "Fever", "Cold", "Cough"],
        doctorList: doctor || [
          "Dr. John Doe",
          "Dr. Jane Doe",
          "Dr. Michael Doe",
        ],
        accountantList: accountant || [
          "Mr. John Doe",
          "Mr. Jane Doe",
          "Mr. Michael Doe",
        ],
        usageList: Usage || ["Before meal", "After meal"],
      },
    };
  } catch {
    return {
      props: {
        medicineList: [
          { medicine: "Paracetamol", price: 0.1 },
          { medicine: "Ibuprofen", price: 0.2 },
          { medicine: "Aspirin", price: 0.3 },
        ],
        diagnosisList: ["Headache", "Fever", "Cold", "Cough"],
        doctorList: ["Dr. John Doe", "Dr. Jane Doe", "Dr. Michael Doe"],
        accountantList: ["Mr. John Doe", "Mr. Jane Doe", "Mr. Michael Doe"],
        usageList: ["Before meal", "After meal"],
      },
    };
  }
};
