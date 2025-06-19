import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Cookies from "js-cookie";

interface AdminPasswordProps {
  onAdmitted: () => void;
}

export default function AdminPassword({ onAdmitted }: AdminPasswordProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setCookie = () => {
    Cookies.set("clinicPlusAdmin", "ClinicPlusAdmin2025!", { expires: 7 }); // Expires in 7 days
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const validPassword = "ClinicPlusAdmin2025!";
    if (password === validPassword) {
      setCookie();
      setPassword("");
      onAdmitted();
    } else {
      alert("Invalid password");
    }
    setLoading(false);
  };

  return (
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
          Admin Password
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
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Enter Admin Password"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
