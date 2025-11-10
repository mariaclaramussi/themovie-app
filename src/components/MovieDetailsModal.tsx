import { Modal, Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useAccount } from "../hooks/useAccount";
import { MovieDetails } from "../types/movie";
import { MovieRatingForm } from "./MovieRatingForm";

const IMG_URL = process.env.REACT_APP_TMDB_IMG_URL;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  maxHeight: "80vh",
  overflow: "scroll",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
};

export const MovieDetailsModal = ({
  movieId,
  open,
  handleClose,
  details,
}: {
  movieId: number;
  open: boolean;
  handleClose: () => void;
  details: MovieDetails | undefined;
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const { favoriteMovies, toggleFavorite } = useAccount();

  useEffect(() => {
    if (!favoriteMovies) return;

    const found = favoriteMovies.results.some((fav: any) => fav.id === movieId);

    setIsFavorite(found);
  }, [favoriteMovies, movieId]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <img
          src={`${IMG_URL}${details?.backdrop_path}`}
          alt={details?.title}
          style={{
            marginBottom: "1rem",
            maxHeight: "300px",
            width: "100%",
            objectFit: "cover",
          }}
        />
        <Box sx={{ px: 4, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <Typography component="h2" sx={{ fontSize: "1.5rem" }}>
                {details?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🎬 {details?.runtime} min | ⭐{" "}
                {details?.vote_average.toFixed(1)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {details?.genres.map((g) => g.name).join(", ")}
            </Typography>
          </Box>

          <Typography sx={{ mt: 2 }}>{details?.overview}</Typography>
          <Button
            onClick={() => toggleFavorite(details?.id!, isFavorite)}
            color={isFavorite ? "error" : "primary"}
            sx={{ mt: 2 }}
          >
            {isFavorite
              ? "💔 Remover dos Favoritos"
              : "⭐ Adicionar aos Favoritos"}
          </Button>

          <MovieRatingForm movieId={movieId} />
        </Box>
      </Box>
    </Modal>
  );
};
