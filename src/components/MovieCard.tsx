import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Movie } from "../types/movie";
import { Button, CardActions, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import { MovieDetailsModal } from "./MovieDetailsModal";
import { useLazyGetMovieDetailsQuery } from "../api/movieApi";
import { useAccount } from "../hooks/useAccount";

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
            {release_date}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => handleOpen(movie.id)}
            color="secondary"
          >
            Saiba mais
          </Button>
          {isFavoriteItem && (
            <Button
              size="small"
              onClick={() => toggleFavorite(movie.id, true)}
              color="error"
            >
              Remover dos favoritos
            </Button>
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
