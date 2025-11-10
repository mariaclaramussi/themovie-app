import { Box, Typography } from "@mui/material";
import MovieCard from "../components/MovieCard";
import { useAccount } from "../hooks/useAccount";
import { Movie } from "../types/movie";
import { GoBackButton } from "../components/GoBackButton";

const FavoritesPage = () => {
  const { favoriteMovies, isLoading } = useAccount();

  if (isLoading) return <p>Carregando favoritos...</p>;
  if (!favoriteMovies) return <p>Nenhum filme favorito encontrado.</p>;

  return (
    <div>
      <Box sx={{ display: "flex", mb: 2, gap: 2 }}>
        <GoBackButton />
        <Typography
          variant="h4"
          sx={{ fontSize: "2rem", fontWeight: "bold", mb: 3 }}
        >
          Meus Favoritos
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
        }}
      >
        {favoriteMovies.results.map((movie: Movie) => (
          <MovieCard movie={movie} key={movie.id} isFavoriteItem />
        ))}
      </Box>
    </div>
  );
};

export default FavoritesPage;
