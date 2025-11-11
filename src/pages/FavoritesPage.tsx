import { Box, Typography } from "@mui/material";
import MovieCard from "../components/MovieCard";
import { useAccount } from "../hooks/useAccount";
import { Movie } from "../types/movie";
import { GoBackButton } from "../components/GoBackButton";
import image from "../assets/images/noRecordsIllustration.svg";

const FavoritesPage = () => {
  const { favoriteMovies, isLoading } = useAccount();

  if (isLoading) return <p>Carregando favoritos...</p>;
  if (!favoriteMovies) return <p>Nenhum filme favorito encontrado.</p>;

  return (
    <div>
      <Box sx={{ display: "flex", mb: 2, gap: 2, alignItems: "center" }}>
        <GoBackButton to="/home" />
        <Typography variant="h4" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
          Meus Favoritos
        </Typography>
      </Box>
      {favoriteMovies.results.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 10,
          }}
        >
          <img
            src={image}
            alt="No Records"
            style={{ maxWidth: "400px", marginBottom: "1rem" }}
          />
          <Typography variant="h6" fontSize="2rem" fontWeight="bold">
            Ops.. Você ainda não adicionou
            <br /> nenhum filme aos favoritos!
          </Typography>
        </Box>
      ) : (
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
      )}
    </div>
  );
};

export default FavoritesPage;
