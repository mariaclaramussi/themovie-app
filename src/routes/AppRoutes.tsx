import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import FavoritesPage from "../pages/FavoritesPage";
import ProtectedRoute from "./ProtectedRoute";
import LogoutPage from "../pages/LogoutPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Route>

      <Route path="*" element={<p>404 - Página não encontrada</p>} />
    </Routes>
  );
}
