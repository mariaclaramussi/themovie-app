import { useParams } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { useGetMoviesByCategoryQuery } from "../api/movieApi";
import MovieCard from "../components/MovieCard";
import { Movie } from "../types/movie";
import { GoBackButton } from "../components/GoBackButton";

const mapCategoryToTitle: { [key: string]: string } = {
  popular: "Filmes Populares",
  top_rated: "Filmes Mais Bem Avaliados",
  upcoming: "Próximos Lançamentos",
  now_playing: "Em Cartaz",
};

export function MovieListPage() {
  const { category } = useParams<{ category: string }>();
  const { data, isLoading } = useGetMoviesByCategoryQuery({
    category: category!,
  });

  if (isLoading) return <p>Carregando...</p>;

  const movies = data?.results || [];

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", mb: 2, gap: 2, alignItems: "center" }}>
        <GoBackButton />
        <Typography variant="h4" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
          {mapCategoryToTitle[category!]}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
        }}
      >
        {movies.map((movie: Movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </Box>
    </Container>
  );
}
