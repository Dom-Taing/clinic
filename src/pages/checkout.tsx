import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CheckOut() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkInTime, setCheckInTime] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      // Get Auth
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      console.log("Session data:", session);

      // If session exists, proceed with check-in
      if (session) {
        // Get the authenticated user
        const user = session.user;
        let { data: userData } = await supabase
          .from("User")
          .select("*")
          .eq("user_id", user.id);
        const currentUser = userData?.[0];
        setUserName(currentUser.name); // Set the authenticated user

        // Check if the user has already checked out today
        const { data: checkInData } = await supabase
          .from("work_time")
          .select("*")
          .eq("user_id", currentUser.id)
          .eq("type", "check_out")
          .gte("time", new Date().toISOString().split("T")[0]); // Check for today's date

        if (checkInData && checkInData.length > 0) {
          // User has already checked out today, redirect to the home page
          setError("You have already checked out today.");
          setLoading(false);
          return;
        }

        // Insert a new check-out record
        const currentDateTime = new Date().toISOString(); // ISO 8601 format for TIMESTAMPTZ
        const { data } = await supabase.from("work_time").insert({
          user_id: currentUser.id,
          type: "check_out",
          time: currentDateTime,
        });
        setCheckInTime(currentDateTime); // Set the check-in time
      } else {
        // Redirect to the sign-in page if no session is found
        // router.push("/signIn");
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show a loading state while checking authentication
  }

  return (
    <div>
      <h1>Check-Out Page</h1>
      {userName ? (
        <>
          <p>Welcome, {userName}!</p>
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <p>
              You have checked out successfully at{" "}
              {new Date(checkInTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true, // Use true for 12-hour format, false for 24-hour format
              })}{" "}
            </p>
          )}
        </>
      ) : (
        <p>Redirecting to sign-in...</p>
      )}
    </div>
  );
}
