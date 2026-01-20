import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useDeleteSessionMutation } from "../api/tmdbAuth";
import { secureLogout, getAuthState } from "../services/authService";
import { toast } from "sonner";

export default function LogoutPage() {
  const navigate = useNavigate();
  const [deleteSession] = useDeleteSessionMutation();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [logoutStep, setLogoutStep] = useState("Iniciando logout seguro");

  useEffect(() => {
    const performSecureLogout = async () => {
      const authState = getAuthState();

      if (!authState.isAuthenticated) {
        toast.info("Você já está desconectado.");
        navigate("/", { replace: true });
        return;
      }

      setLogoutStep("Revogando token local");

      // Executa logout seguro com callback para invalidar no servidor TMDB
      const result = await secureLogout(async (sessionId: string) => {
        setLogoutStep("Invalidando sessão no servidor TMDB");
        await deleteSession({ session_id: sessionId }).unwrap();
      });

      if (result.success) {
        setLogoutStep("Limpando dados locais");
        toast.success("Sessão encerrada com segurança!");
      } else {
        toast.error(result.error || "Erro no logout. Dados locais foram limpos.");
      }

      setIsLoggingOut(false);

      setTimeout(() => {
        navigate("/", { replace: true });
        window.location.reload();
      }, 500);
    };

    performSecureLogout();
  }, [deleteSession, navigate]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
      <Typography variant="h5" gutterBottom>
        Encerrando sua sessão...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {logoutStep}
      </Typography>
      {isLoggingOut && <CircularProgress />}
    </Box>
  );
}
