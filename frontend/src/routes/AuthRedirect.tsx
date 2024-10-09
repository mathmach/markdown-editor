import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthRedirect: React.FC<{
  children: React.ReactNode;
  redirectTo: string;
}> = ({ children, redirectTo }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(redirectTo); // Redireciona se o usuário estiver logado
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return <>{children}</>; // Renderiza os filhos se não houver redirecionamento
};

export default AuthRedirect;
