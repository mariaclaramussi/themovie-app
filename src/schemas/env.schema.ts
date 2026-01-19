import { z } from "zod";

const envSchema = z.object({
  REACT_APP_TMDB_API_KEY: z.string().min(1, "TMDB API key é obrigatória"),
  REACT_APP_TMDB_BASE_URL: z.string().url("URL base do TMDB inválida"),
  REACT_APP_TMDB_IMG_URL: z.string().url("URL de imagens do TMDB inválida"),
});

function validateEnv() {
  const result = envSchema.safeParse({
    REACT_APP_TMDB_API_KEY: process.env.REACT_APP_TMDB_API_KEY,
    REACT_APP_TMDB_BASE_URL: process.env.REACT_APP_TMDB_BASE_URL,
    REACT_APP_TMDB_IMG_URL: process.env.REACT_APP_TMDB_IMG_URL,
  });

  if (!result.success) {

    const errors = result.error.issues
      .map((err) => `  - ${err.path.join(":")}: ${err.message}`)
      .join("\n");

    console.error("❌ Erro nas variáveis de ambiente:\n" + errors);
    console.error("\n📝 Verifique seu arquivo .env com base no .env.example");

    throw new Error("Variáveis de ambiente inválidas");
  }

  return result.data;
}

export const env = validateEnv();
