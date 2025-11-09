import { Box, Button, Typography } from "@mui/material";
import { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
  title: string;
}

const MovieList = (props: MovieListProps) => {
  const { movies, title } = props;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h2">{title}</Typography>
        <Button>Ver mais</Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        {movies.map((movie) => (
          <MovieCard movie={movie} />
        ))}
      </Box>
    </Box>
  );
};

export default MovieList;
