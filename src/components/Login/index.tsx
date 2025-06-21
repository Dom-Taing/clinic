import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import React from "react";
import styled from "@emotion/styled";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const StyledPaper = styled(Paper)`
  padding: 1rem;
`;

const Wrapper = styled.div`
  max-width: 500px;
`;
const LoginForm = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const [password, setPassword] = React.useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const setCookie = () => {
    Cookies.set("clinicPlus", "ClinicPlus2025!", { expires: 7 }); // Expires in 7 days
  };

  const onSubmit = () => {
    const validPassword = "ClinicPlus2025!";
    if (password === validPassword) {
      setCookie();
      setPassword("");
      router.push("/");
    } else {
      alert("Invalid password");
    }
  };

  return (
    <Wrapper>
      <StyledPaper elevation={2}>
        <FormControl fullWidth>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                id="password-field"
                label="password"
                fullWidth
                onChange={onChange}
                name="password"
                type="password"
                value={password}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button variant="contained" color="primary" onClick={onSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </StyledPaper>
    </Wrapper>
  );
};

export default LoginForm;
