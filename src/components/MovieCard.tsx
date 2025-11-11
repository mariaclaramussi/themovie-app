import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Movie } from "../types/movie";
import {
  Button,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { MovieDetailsModal } from "./MovieDetailsModal";
import { useLazyGetMovieDetailsQuery } from "../api/movieApi";
import { useAccount } from "../hooks/useAccount";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { format } from "date-fns";

const IMG_URL = process.env.REACT_APP_TMDB_IMG_URL;

export default function MovieCard({
  movie,
  isFavoriteItem,
}: {
  movie: Movie;
  isFavoriteItem?: boolean;
}) {
  const { title, poster_path, release_date } = movie;

  const [open, setOpen] = useState(false);

  const { toggleFavorite } = useAccount();

  const [fetchMovieDetails, { data: movieDetails }] =
    useLazyGetMovieDetailsQuery();

  const handleOpen = (id: number) => {
    setOpen(true);
    fetchMovieDetails({ id, language: "pt-BR" });
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Card>
        <CardMedia
          component="img"
          image={`${IMG_URL}${poster_path}`}
          alt={title}
        />
        <CardContent sx={{ p: 1 }}>
          <Typography>{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(release_date), "dd/MM/yyyy")}
          </Typography>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            size="small"
            onClick={() => handleOpen(movie.id)}
            color="secondary"
          >
            Saiba mais
          </Button>
          {isFavoriteItem && (
            <IconButton
              size="small"
              onClick={() => toggleFavorite(movie.id, true)}
              color="error"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </CardActions>
      </Card>
      <MovieDetailsModal
        movieId={movie.id}
        open={open}
        handleClose={handleClose}
        details={movieDetails}
      />
    </>
  );
}
