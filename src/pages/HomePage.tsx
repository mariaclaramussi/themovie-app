import { Grid } from "@mui/material";
import {} from "../api/movieApi";
import MovieList from "../components/MovieList";

export default function Home() {
  return (
    <Grid container spacing={2}>
      <MovieList category="now_playing" title="Em cartaz" />
      <MovieList category="top_rated" title="Mais bem avaliados" />
      <MovieList category="popular" title="Populares" />
      <MovieList category="upcoming" title="Em breve" />
    </Grid>
  );
}
