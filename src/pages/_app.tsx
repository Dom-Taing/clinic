import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { SupabaseProvider } from "@/context/supabase";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SupabaseProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Component {...pageProps} />
      </LocalizationProvider>
    </SupabaseProvider>
  );
}
