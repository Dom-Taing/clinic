import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import AdminPassword from "@/components/AdminPassword";
import { useSupabase } from "@/context/supabase";

export default function SignUp() {
  const supabase = useSupabase();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setError("");

    // Validate that passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const cleanedUsername = username
        .trim()
        .replace(/\s+/g, "_")
        .toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: `${cleanedUsername}@user.com`,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        alert("Sign-up successful!");
        router.push("/"); // Redirect to the home page or login page after sign-up
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
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
            Sign Up
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
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </main>
  );
}
