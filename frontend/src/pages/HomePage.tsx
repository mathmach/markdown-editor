import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthRedirect from "../routes/AuthRedirect";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthRedirect redirectTo="/documents">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Bem-vindo ao Editor Colaborativo
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/register")}
          style={{ marginTop: "16px" }}
        >
          Registrar-se
        </Button>
      </Box>
    </AuthRedirect>
  );
};

export default HomePage;
