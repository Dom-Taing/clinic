import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import AdminPassword from "@/components/AdminPassword";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Logout() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const signOutUser = async () => {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) {
        setError("Failed to sign out. Please try again.");
      } else {
        router.push("/login"); // Redirect to the login page after signing out
      }
    };

    if (isAdmin) {
      signOutUser();
    }
  }, [router]);

  if (!isAdmin) {
    return (
      <main>
        <AdminPassword
          onAdmitted={() => {
            setIsAdmin(true);
          }}
        />
      </main>
    );
  }

  return error ? error : <p>Signing you out...</p>; // Optional: Show a message while signing out
}
