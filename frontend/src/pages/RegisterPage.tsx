import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthRedirect from "../routes/AuthRedirect";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth(); // Obter o token do contexto
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email, password);
    navigate("/login");
  };

  return (
    <AuthRedirect redirectTo="/documents">
      <Container maxWidth="xs" style={{ marginTop: "100px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#f3f3f3",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Registro
          </Typography>
          <form onSubmit={handleRegister} style={{ width: "100%" }}>
            <TextField
              variant="outlined"
              label="Nome"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              variant="outlined"
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              variant="outlined"
              label="Senha"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Registrar
            </Button>
            <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
              Já tem uma conta?{" "}
              <Link href="/login" variant="body2">
                Faça login
              </Link>
            </Typography>
          </form>
        </Box>
      </Container>
    </AuthRedirect>
  );
};

export default RegisterPage;
