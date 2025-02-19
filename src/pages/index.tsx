import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { createSupaClient } from "@/service/supa";
import { clinic } from "@/types/common";
import { Paper } from "@mui/material";
import styled from "@emotion/styled";
import Link from "next/link";
import { getCookieValue } from "@/utils/parseCookie";

const inter = Inter({ subsets: ["latin"] });

const StyledPaper = styled(Paper)`
  padding: 1rem;
  width: 100%;
  cursor: pointer;
`;

const Wrapper = styled.div`
  min-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-direction: column;
`;

interface HomeProps {
  clinic: clinic[];
}

export default function Home({ clinic }: HomeProps) {
  return (
    <>
      <main className={`${styles.main} ${inter.className}`}>
        <Wrapper>
          {clinic.map((clinic) => (
            <StyledPaper
              key={clinic.id}
              elevation={2}
              onClick={() => {
                window.location.href = `/${clinic.name}`;
              }}
            >
              <Link href={`/${clinic.name}`}>{clinic.name}</Link>
            </StyledPaper>
          ))}
        </Wrapper>
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
          destination: `/login?redirect=${context.resolvedUrl}`,
          permanent: false,
        },
      };
    }
    // const clinicId = process.env.SOKSAN_ID ?? "";
    const supabase = createSupaClient();
    let { data: Clinic } = await supabase.from("Clinic").select("*");
    // let { data: Medicine } = await supabase
    //   .from("Medicine")
    //   .select("*")
    //   .eq("clinic", clinicId);
    // let { data: Diagnosis } = await supabase.from("Sickness").select("*");
    // let { data: User } = await supabase
    //   .from("User")
    //   .select("*")
    //   .eq("clinic", clinicId);
    // let { data: Usage } = await supabase.from("Usage").select("*");
    // const doctor = User?.filter((user) => user.role === "doctor");
    // const accountant = User?.filter((user) => user.role === "accountant");

    return {
      props: {
        clinic: Clinic || [],
      },
    };
  } catch {
    return {
      props: {
        clinic: [],
      },
    };
  }
};
