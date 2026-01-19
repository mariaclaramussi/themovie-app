import { z } from "zod";

// Schema para validar session_id do TMDB
// O session_id do TMDB é uma string alfanumérica de ~40 caracteres
export const sessionIdSchema = z
  .string()
  .min(1, "Session ID não pode ser vazio")
  .regex(/^[a-zA-Z0-9]+$/, "Session ID deve conter apenas letras e números");

export type SessionId = z.infer<typeof sessionIdSchema>;

/**
 * Recupera e valida o session_id do localStorage
 */
export function getValidSessionId(): string | null {
  const storedValue = localStorage.getItem("session_id");

  if (!storedValue) {
    return null;
  }

  const result = sessionIdSchema.safeParse(storedValue);

  if (!result.success) {
    console.warn("Session ID inválido no localStorage, removendo...");
    localStorage.removeItem("session_id");
    return null;
  }

  return result.data;
}

/**
 * Salva o session_id no localStorage após validação
 */
export function setValidSessionId(sessionId: string): boolean {
  const result = sessionIdSchema.safeParse(sessionId);

  if (!result.success) {
    console.error("Tentativa de salvar session_id inválido:", result.error.message);
    return false;
  }

  localStorage.setItem("session_id", result.data);
  return true;
}

/**
 * Remove o session_id do localStorage
 */
export function clearSessionId(): void {
  localStorage.removeItem("session_id");
}
