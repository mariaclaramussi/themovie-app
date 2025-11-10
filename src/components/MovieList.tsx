import { Box, Button, Link, Typography } from "@mui/material";
import MovieCard from "./MovieCard";
import { useGetMoviesByCategoryQuery } from "../api/movieApi";
import { Movie } from "../types/movie";

interface MovieListProps {
  title: string;
  category: string;
}

const MovieList = (props: MovieListProps) => {
  const { category, title } = props;

  const { data, isLoading } = useGetMoviesByCategoryQuery({ category });

  const movies = data?.results?.slice(0, 3) || [];

  if (isLoading) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h2" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
          {title}
        </Typography>
        <Button component={Link} href={`/movies/${category}`}>
          Ver mais
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </Box>
    </Box>
  );
};

export default MovieList;
