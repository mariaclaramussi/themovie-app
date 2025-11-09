import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import { Movie } from "../types/movie";
import {
  Box,
  Button,
  CardActions,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLazyGetMovieDetailsQuery } from "../api/movieApi";

const IMG_URL = process.env.REACT_APP_TMDB_IMG_URL;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

export default function MovieCard({ movie }: { movie: Movie }) {
  const { title, poster_path, overview } = movie;
  const [open, setOpen] = useState(false);

  const [
    fetchMovieDetails,
    { data: movieDetails, isFetching: isFetchingDetails },
  ] = useLazyGetMovieDetailsQuery();

  const handleOpen = (id: number) => {
    setOpen(true);
    fetchMovieDetails({ id });
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader title={title} subheader="September 14, 2016" />
        <CardMedia
          component="img"
          image={`${IMG_URL}${poster_path}`}
          alt={title}
        />
        <CardActions>
          <Button size="small" onClick={() => handleOpen(movie.id)}>
            Saiba mais
          </Button>
        </CardActions>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {isFetchingDetails ? (
            <CircularProgress />
          ) : (
            <>
              <img
                src={`${IMG_URL}${movieDetails?.backdrop_path}`}
                alt={title}
                style={{ marginBottom: "1rem" }}
              />
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {title}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {overview}
              </Typography>
              <Typography variant="body2" mt={1}>
                🎬 {movieDetails?.runtime} min | ⭐{" "}
                {movieDetails?.vote_average.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {movieDetails?.genres.map((g) => g.name).join(", ")}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
