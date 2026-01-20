import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useCreateRequestTokenMutation,
  useCreateSessionMutation,
} from "../api/tmdbAuth";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { createAuthSession, getAuthState } from "../services/authService";
import { toast } from "sonner";

const TMDB_AUTH_URL = "https://www.themoviedb.org/authenticate";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [createRequestToken, { isLoading }] = useCreateRequestTokenMutation();
  const [createSession] = useCreateSessionMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const authState = getAuthState();
    if (authState.isAuthenticated) {
      toast.info("Você já está logado!");
      navigate("/home", { replace: true });
      return;
    }

    const params = new URLSearchParams(location.search);
    const approvedToken = params.get("request_token");

    if (approvedToken) {
      handleCreateSession(approvedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleLogin = async () => {
    try {
      const { request_token } = await createRequestToken().unwrap();
      window.location.href = `${TMDB_AUTH_URL}/${request_token}?redirect_to=${window.location.origin}/`;
    } catch (error) {
      console.error("Erro ao criar request token", error);
      toast.error("Erro ao iniciar login. Tente novamente.");
    }
  };

  const handleCreateSession = async (request_token: string) => {
    setIsProcessing(true);

    try {
      const { session_id } = await createSession({
        request_token,
      }).unwrap();

      // Cria sessão JWT segura com o session_id do TMDB
      const success = createAuthSession(session_id);

      if (!success) {
        console.error("Erro ao criar sessão JWT local");
        toast.error("Erro ao validar sessão. Tente novamente.");
        setIsProcessing(false);
        return;
      }

      toast.success("Login realizado com sucesso!");
      navigate("/home", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Erro ao criar sessão", error);
      toast.error("Erro ao criar sessão. Tente novamente.");
      setIsProcessing(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center">
        Login com
        <br /> The Movie DB
      </Typography>
      {isLoading || isProcessing ? (
        <>
          <CircularProgress />
          {isProcessing && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Gerando sessão segura
            </Typography>
          )}
        </>
      ) : (
        <Button
          variant="contained"
          color="primary"
          sx={{ fontWeight: "bold" }}
          onClick={handleLogin}
        >
          Entrar com The Movie Database
        </Button>
      )}
    </Box>
  );
}
