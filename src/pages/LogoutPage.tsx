import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useDeleteSessionMutation } from "../api/tmdbAuth";

export default function LogoutPage() {
  const navigate = useNavigate();
  const [deleteSession, { isLoading }] = useDeleteSessionMutation();

  useEffect(() => {
    const logout = async () => {
      const session_id = localStorage.getItem("session_id");

      if (session_id) {
        try {
          await deleteSession({ session_id }).unwrap();
        } catch (err) {
          console.error("Erro ao encerrar sessão TMDB:", err);
        }
      }

      localStorage.removeItem("session_id");

      navigate("/", { replace: true });
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
