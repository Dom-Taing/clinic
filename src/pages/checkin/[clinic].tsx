import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import calculateDistance from "@/utils/calculateDistance";
import { createSupaClient } from "@/service/supa";
import { getCookieValue } from "@/utils/parseCookie";
import { GetServerSideProps } from "next";
import axios from "axios";
import { convertToDefault } from "@/utils/workTime/convertToTimeZone";
import { useSupabase } from "@/context/supabase";
interface CheckInProps {
  clinicLocation: string;
}

export default function CheckIn({ clinicLocation }: CheckInProps) {
  const supabase = useSupabase();
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
            navigator.geolocation.getCurrentPosition(resolve, (err) => {
              // Custom error handling for location failure
              if (err.code === 1) {
                // PERMISSION_DENIED
                setError(
                  "Location permission denied. Please allow location access to check in."
                );
              } else if (err.code === 2) {
                // POSITION_UNAVAILABLE
                setError("Location information is unavailable.");
              } else if (err.code === 3) {
                // TIMEOUT
                setError("Location request timed out. Please try again.");
              } else {
                setError("Unable to retrieve your location.");
              }
              setLoading(false);
              reject(err);
            });
          }
        );
        const { latitude, longitude } = position.coords;
        const clinicCoords = clinicLocation.split(",").map(Number);
        // Calculate the distance to the target location
        const distance = calculateDistance(
          latitude,
          longitude,
          clinicCoords[0],
          clinicCoords[1]
        ); // Example coordinates for a location

        if (distance >= 100) {
          setError("You are not at the designated check-in location.");
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

        const now = new Date();
        const todayISOTtime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        ).toISOString();

        // Check if the user has already checked in today
        const { data: checkInData } = await supabase
          .from("work_time")
          .select("*")
          .eq("user_id", currentUser.id)
          .eq("type", "check_in")
          .gte("time", todayISOTtime); // Check for today's date

        if (checkInData && checkInData.length > 0) {
          const lastCheckIn = checkInData[0].time;
          const lastCheckInDate = new Date(lastCheckIn).toLocaleTimeString(
            "en-US",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true, // Use true for 12-hour format, false for 24-hour format
            }
          );
          setError(`You have already checked in today at ${lastCheckInDate}`);
          setLoading(false);
          return;
        }

        // Insert a new check-in record
        const currentDateTime = new Date().toISOString(); // ISO 8601 format for TIMESTAMPTZ
        await supabase.from("work_time").insert({
          user_id: currentUser.id,
          type: "check_in",
          time: currentDateTime,
        });

        const { data: telegramData, error: telegramError } = await supabase
          .from("telegram_groups")
          .select("*")
          .eq("function", "work_time")
          .eq("clinic_id", userData?.[0].clinic);

        // Send the summary to Telegram
        const telegramBotToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
        const telegramChatId = telegramData?.[0].group_code;
        const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        const summaryMessage = `Doctor: ${
          currentUser.name_kh
        }\nChecked in at: ${convertToDefault(currentDateTime)}`;

        await axios.post(telegramApiUrl, {
          chat_id: telegramChatId,
          text: summaryMessage,
          parse_mode: "Markdown", // Optional: Use Markdown for formatting
        });

        setCheckInTime(currentDateTime); // Set the check-in time
      } catch (error) {
        setError((prev) =>
          prev ? prev : "Unable to retrieve location or complete check-in."
        );
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
      <h1>Check-In Page</h1>
      <p>Welcome, {userName}!</p>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>
          You have checked in successfully at{" "}
          {new Date(checkInTime).toLocaleTimeString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true, // Use true for 12-hour format, false for 24-hour format
          })}{" "}
        </p>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<CheckInProps> = async (
  context
) => {
  try {
    const { clinic } = context.params as { clinic: string };
    const supabase = createSupaClient();

    let { data: Clinic } = await supabase
      .from("Clinic")
      .select("*")
      .eq("name", clinic);
    if (!Clinic?.length) {
      return { redirect: { destination: "/", permanent: false } };
    }

    return {
      props: {
        clinicLocation: Clinic[0].location || "",
      },
    };
  } catch {
    return {
      redirect: {
        destination: `/password?redirect=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }
};
