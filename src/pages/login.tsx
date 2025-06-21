import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Autocomplete,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import AdminPassword from "@/components/AdminPassword";
import { createSupaClient } from "@/service/supa";
import { GetServerSideProps } from "next";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

interface SignInProps {
  doctorList: { id: string; name: string; clinic: { name: string }[] }[];
}

export default function SignIn({ doctorList }: SignInProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("1234567890");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      // Get Auth
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session) {
        // Redirect to the sign-in page if no session is found
        router.push("/");
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const cleanedUsername = formatUsername(username);
      const signInResponse = await signInUser(cleanedUsername, password);

      if (signInResponse.error) {
        setError(signInResponse.error.message);
        return;
      }

      const revokeResponse = await revokeOtherSessions();

      if (revokeResponse.error) {
        console.error(
          "Error revoking other sessions:",
          revokeResponse.error.message
        );
        setError("Failed to log out from other devices.");
        return;
      }

      alert("Sign-in successful!");
      router.push("/");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format the username
  const formatUsername = (username: string): string => {
    return username.trim().replace(/\s+/g, "_").toLowerCase();
  };

  // Helper function to sign in the user
  const signInUser = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${username}@user.com`,
        password,
      });
      return { data, error };
    } catch (err) {
      console.error("Error during sign-in:", err);
      throw new Error("Failed to sign in.");
    }
  };

  // Helper function to revoke other sessions
  const revokeOtherSessions = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: "others" });
      return { error };
    } catch (err) {
      console.error("Error revoking other sessions:", err);
      throw new Error("Failed to revoke other sessions.");
    }
  };

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

  return (
    <main>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "2rem",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Sign In
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
            noValidate
            autoComplete="off"
          >
            <Autocomplete
              disablePortal
              options={doctorList.map((item) => item.name)}
              // freeSolo
              value={username}
              onChange={(e, newValue) => {
                setUsername(newValue || "");
              }}
              autoSelect
              renderInput={(params) => (
                <TextField {...params} label={"user name"} />
              )}
            />
            {/* <TextField
              label="username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /> */}
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSignIn}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<SignInProps> = async (
  context
) => {
  try {
    const supabase = createSupaClient();

    let { data: doctor } = await supabase
      .from("User")
      .select("id, name, clinic (name)")
      .eq("role", "doctor");

    return {
      props: {
        doctorList: doctor || [],
      },
    };
  } catch {
    return {
      props: {
        doctorList: [],
      },
    };
  }
};
