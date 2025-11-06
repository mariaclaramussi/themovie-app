import { Grid, Typography } from "@mui/material";
import { useGetPopularMoviesQuery } from "../api/movieApi";

export default function Home() {
  const { data, isLoading } = useGetPopularMoviesQuery(1);

  if (isLoading) return <Typography>Carregando...</Typography>;

  console.log(data);

  return (
    <Grid container spacing={2}>
      HOME
    </Grid>
  );
}
