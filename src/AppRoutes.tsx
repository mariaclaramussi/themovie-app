import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import MovieDetails from "./pages/MovieDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/details" element={<MovieDetails />} />
    </Routes>
  );
}
