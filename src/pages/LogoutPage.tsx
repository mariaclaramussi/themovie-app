import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useDeleteSessionMutation } from "../api/tmdbAuth";
import { getValidSessionId, clearSessionId } from "../schemas/session.schema";
import { toast } from "sonner";

export default function LogoutPage() {
  const navigate = useNavigate();
  const [deleteSession, { isLoading }] = useDeleteSessionMutation();

  useEffect(() => {
    const logout = async () => {
      const session_id = getValidSessionId();

      if (session_id) {
        try {
          await deleteSession({ session_id }).unwrap();
          toast.success("Sessão encerrada com sucesso!");
        } catch (err) {
          console.error("Erro ao encerrar sessão TMDB:", err);
          toast.error("Erro ao encerrar sessão. Você será desconectado localmente.");
        }
      }

      clearSessionId();

      navigate("/", { replace: true });
      window.location.reload();
    };

    logout();
  }, [deleteSession, navigate]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
      <Typography variant="h5" gutterBottom>
        Encerrando sua sessão...
      </Typography>
      {isLoading && <CircularProgress />}
    </Box>
  );
}
