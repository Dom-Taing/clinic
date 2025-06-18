import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SignIn() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      // Get Auth
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      console.log("Session data:", session);
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
      const cleanedUsername = username
        .trim()
        .replace(/\s+/g, "_")
        .toLowerCase();
      const { error } = await supabase.auth.signInWithPassword({
        email: `${cleanedUsername}@user.com`,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        alert("Sign-in successful!");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

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
            <TextField
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
            />
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
