import { Grid, Typography } from "@mui/material";
import {
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
} from "../api/movieApi";
import MovieList from "../components/MovieList";

export default function Home() {
  const { data: topRatedMovies, isLoading: isLoadingTopRated } =
    useGetTopRatedMoviesQuery({
      page: 1,
      language: "pt-BR",
    });

  const { data: popularMovies, isLoading: isLoadingPopular } =
    useGetPopularMoviesQuery({
      page: 1,
      language: "pt-BR",
    });

  const isLoading = isLoadingTopRated || isLoadingPopular;
  if (isLoading) return <Typography>Carregando...</Typography>;

  return (
    <Grid container spacing={2}>
      <MovieList
        movies={topRatedMovies?.results.slice(0, 3) || []}
        title="Melhores Avaliados"
      />
      <MovieList
        movies={popularMovies?.results.slice(0, 3) || []}
        title="Filmes Populares"
      />
    </Grid>
  );
}
