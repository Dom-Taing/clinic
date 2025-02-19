import React from "react";
import { GetServerSideProps } from "next";
import LoginForm from "@/components/Login";
import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import cookie from "cookie";
import { getCookieValue } from "@/utils/parseCookie";

const inter = Inter({ subsets: ["latin"] });

interface LoginProps {
  test: string;
}

export const Login = () => {
  return (
    <main className={`${styles.main} ${inter.className}`}>
      <LoginForm />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<LoginProps> = async (
  context
) => {
  const clinicPlus = getCookieValue(context.req.headers.cookie, "clinicPlus");
  if (clinicPlus === "ClinicPlus2025!") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      test: "test",
    },
  };
};

export default Login;
