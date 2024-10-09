import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const { token } = useAuth();

  return token ? (
    <div>
      <Header /> {/* O Header é sempre mostrado */}
      <main>
        <Outlet /> {/* Exibe o conteúdo da rota protegida */}
      </main>
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
