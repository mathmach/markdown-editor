import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthRedirect from "../routes/AuthRedirect";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
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
            Login
          </Typography>
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
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
              Entrar
            </Button>
            <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
              Não tem uma conta?{" "}
              <Link href="/register" variant="body2">
                Registre-se
              </Link>
            </Typography>
          </form>
        </Box>
      </Container>
    </AuthRedirect>
  );
};

export default LoginPage;
