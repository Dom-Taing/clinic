import { createContext, useContext } from "react";
import { supabase } from "@/service/client_supa";

const SupabaseContext = createContext(supabase);

export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <SupabaseContext.Provider value={supabase}>
    {children}
  </SupabaseContext.Provider>
);

export const useSupabase = () => useContext(SupabaseContext);
