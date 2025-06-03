import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import ReportForm from "@/components/ReportForm";
const inter = Inter({ subsets: ["latin"] });

// scan: rouch rol, nov sol

export default function Home() {
  return (
    <main className={`${styles.main} ${inter.className}`}>
      <ReportForm />
    </main>
  );
}
