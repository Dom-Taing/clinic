import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import calculateDistance from "@/utils/calculateDistance";

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

      if (!session) {
        setError("No session found. Redirecting to login...");
        router.push("/login");
        setLoading(false);
        return;
      }

      try {
        // Wait for the user's location
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );
        const { latitude, longitude } = position.coords;
        // Calculate the distance to the target location
        const distance = calculateDistance(
          latitude,
          longitude,
          47.6256242,
          -122.3571215
        ); // Example coordinates for a location

        if (distance >= 100) {
          setError("You are not at the designated check-out location.");
          setLoading(false);
          return;
        }

        // Get the authenticated user
        const user = session.user;
        const { data: userData } = await supabase
          .from("User")
          .select("*")
          .eq("user_id", user.id);

        const currentUser = userData?.[0];
        setUserName(currentUser.name); // Set the authenticated user

        // Check if the user has already checked in today
        const { data: checkInData } = await supabase
          .from("work_time")
          .select("*")
          .eq("user_id", currentUser.id)
          .eq("type", "check_out")
          .gte("time", new Date().toISOString().split("T")[0]); // Check for today's date

        if (checkInData && checkInData.length > 0) {
          setError("You have already checked in today.");
          setLoading(false);
          return;
        }

        // Insert a new check-in record
        const currentDateTime = new Date().toISOString(); // ISO 8601 format for TIMESTAMPTZ
        await supabase.from("work_time").insert({
          user_id: currentUser.id,
          type: "check_out",
          time: currentDateTime,
        });

        setCheckInTime(currentDateTime); // Set the check-in time
      } catch (error) {
        setError("Unable to retrieve location or complete check-out.");
      } finally {
        setLoading(false);
      }
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
