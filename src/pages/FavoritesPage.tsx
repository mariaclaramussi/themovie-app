import { useAccount } from "../hooks/useAccount";

const FavoritesPage = () => {
  const { favoriteMovies, toggleFavorite, isLoading } = useAccount();

  if (isLoading) return <p>Carregando favoritos...</p>;
  if (!favoriteMovies) return <p>Nenhum filme favorito encontrado.</p>;

  return (
    <div>
      <h2>Meus Favoritos</h2>
      <ul>
        {favoriteMovies.results.map((movie: any) => (
          <li key={movie.id}>
            {movie.title}{" "}
            <button onClick={() => toggleFavorite(movie.id, true)}>
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
