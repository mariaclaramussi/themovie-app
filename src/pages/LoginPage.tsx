import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useCreateRequestTokenMutation,
  useCreateSessionMutation,
} from "../api/tmdbAuth";
import { Box, Typography, CircularProgress, Button } from "@mui/material";

const TMDB_AUTH_URL = "https://www.themoviedb.org/authenticate";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [createRequestToken, { isLoading }] = useCreateRequestTokenMutation();
  const [createSession] = useCreateSessionMutation();

  useEffect(() => {
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
    }
  };

  const handleCreateSession = async (request_token: string) => {
    try {
      const { session_id } = await createSession({
        request_token,
      }).unwrap();
      localStorage.setItem("session_id", session_id);
      navigate("/home");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao criar sessão", error);
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
      {isLoading ? (
        <CircularProgress />
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
