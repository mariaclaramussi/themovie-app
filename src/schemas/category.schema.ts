import { z } from "zod";

// Categorias válidas
export const validCategories = [
  "popular",
  "top_rated",
  "upcoming",
  "now_playing",
] as const;

export const categorySchema = z.enum(validCategories, {
  message: "Categoria inválida",
});

export type MovieCategory = z.infer<typeof categorySchema>;

// Map de categorias para títulos
export const categoryTitles: Record<MovieCategory, string> = {
  popular: "Filmes Populares",
  top_rated: "Filmes Mais Bem Avaliados",
  upcoming: "Próximos Lançamentos",
  now_playing: "Em Cartaz",
};

/**
 * Valida categria
 */
export function validateCategory(category: string | undefined): MovieCategory | null {
  const result = categorySchema.safeParse(category);
  return result.success ? result.data : null;
}

/**
 * Verifica se uma categoria é válida (type guard)
 */
export function isValidCategory(category: string | undefined): category is MovieCategory {
  return categorySchema.safeParse(category).success;
}
