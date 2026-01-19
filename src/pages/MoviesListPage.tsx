import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Pagination, Typography } from "@mui/material";
import { useGetMoviesByCategoryQuery } from "../api/movieApi";
import MovieCard from "../components/MovieCard";
import { MovieCardSkeleton } from "../components/MovieCardSkeleton";
import { Movie } from "../types/movie";
import { GoBackButton } from "../components/GoBackButton";

const mapCategoryToTitle: { [key: string]: string } = {
  popular: "Filmes Populares",
  top_rated: "Filmes Mais Bem Avaliados",
  upcoming: "Próximos Lançamentos",
  now_playing: "Em Cartaz",
};

const ITEMS_PER_PAGE = 12;

export function MovieListPage() {
  const { category } = useParams<{ category: string }>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetMoviesByCategoryQuery({
    category: category!,
    page,
  });

  if (isLoading || isFetching) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: "flex", mb: 2, gap: 2, alignItems: "center" }}>
          <GoBackButton to="/home" />
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
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </Box>
      </Container>
    );
  }

  const allMovies = data?.results || [];
  const movies = allMovies.slice(0, ITEMS_PER_PAGE);
  const totalPages = Math.min(data?.total_pages || 1, 500); // TMDB limita a 500 páginas

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", mb: 2, gap: 2, alignItems: "center" }}>
        <GoBackButton to="/home" />
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

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
}
