import { useParams } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { useGetMoviesByCategoryQuery } from "../api/movieApi";
import MovieCard from "../components/MovieCard";
import { Movie } from "../types/movie";

export function MovieListPage() {
  const { category } = useParams<{ category: string }>();
  const { data, isLoading } = useGetMoviesByCategoryQuery({
    category: category!,
  });

  if (isLoading) return <p>Carregando...</p>;

  const movies = data?.results || [];

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {category?.replace("_", " ").toUpperCase()}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {movies.map((movie: Movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </Box>
    </Container>
  );
}
