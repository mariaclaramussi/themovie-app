import { z } from "zod";
import {
  generateJwt,
  verifyJwt,
  isJwtExpiringSoon,
  getJwtTimeRemaining,
  JwtPayload,
} from "./jwtService";

const AUTH_TOKEN_KEY = "auth_token";
const LOGOUT_TIMESTAMP_KEY = "logout_timestamp";

// Valida o token armazenado
const storedTokenSchema = z.string().min(10);

// Lista de tokens revogados (em prod, seria um endpoint de API)
const revokedTokens = new Set<string>();

export interface AuthState {
  isAuthenticated: boolean;
  sessionId: string | null;
  accountId: string | null;
  username: string | null;
  expiresIn: number;
}

export function storeAuthToken(token: string): boolean {
  try {
    const payload = verifyJwt(token);
    if (!payload) {
      console.error("Tentativa de armazenar token inválido");
      return false;
    }

    // Usa sessionStorage para maior segurança (limpa ao fechar aba)
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);

    // Armazena no localStorage para persistência entre abas
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    return true;
  } catch (error) {
    console.error("Erro ao armazenar token:", error);
    return false;
  }
}

export function getAuthToken(): string | null {
  try {
    // Tenta sessionStorage primeiro, depois localStorage
    let token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      token = localStorage.getItem(AUTH_TOKEN_KEY);
    }

    if (!token) return null;

    const result = storedTokenSchema.safeParse(token);
    if (!result.success) {
      clearAuthData();
      return null;
    }

    if (revokedTokens.has(token)) {
      console.warn("Token foi revogado");
      clearAuthData();
      return null;
    }

    const payload = verifyJwt(token);
    if (!payload) {
      clearAuthData();
      return null;
    }

    return token;
  } catch (error) {
    console.error("Erro ao recuperar token:", error);
    return null;
  }
}

/**
 * Obtém o estado atual de autenticação
 */
export function getAuthState(): AuthState {
  const token = getAuthToken();

  if (!token) {
    return {
      isAuthenticated: false,
      sessionId: null,
      accountId: null,
      username: null,
      expiresIn: 0,
    };
  }

  const payload = verifyJwt(token);
  if (!payload) {
    return {
      isAuthenticated: false,
      sessionId: null,
      accountId: null,
      username: null,
      expiresIn: 0,
    };
  }

  return {
    isAuthenticated: true,
    sessionId: payload.sessionId,
    accountId: payload.accountId || null,
    username: payload.username || null,
    expiresIn: getJwtTimeRemaining(token),
  };
}

/**
 * Cria uma nova sessão de autenticação
 */
export function createAuthSession(
  sessionId: string,
  accountId?: string,
  username?: string
): boolean {
  const token = generateJwt(sessionId, accountId, username);
  return storeAuthToken(token);
}

/**
 * Limpa todos os dados de autenticação
 */
export function clearAuthData(): void {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);

  localStorage.removeItem("session_id");

  // Registra timestamp do logout para invalidar tokens antigos
  localStorage.setItem(LOGOUT_TIMESTAMP_KEY, Date.now().toString());

  // Limpa outros dados sensíveis
  sessionStorage.clear();
}

/**
 * Adiciona token a lista de revogados
 */
export function revokeToken(token: string): void {
  revokedTokens.add(token);
}

/**
 * Executa logout seguro
 * Retorna uma Promise se logout estiver completo
 */
export async function secureLogout(
  deleteSessionFromServer: (sessionId: string) => Promise<void>
): Promise<{ success: boolean; error?: string }> {
  const token = getAuthToken();

  if (!token) {
    clearAuthData();
    return { success: true };
  }

  const payload = verifyJwt(token);

  revokeToken(token);

  if (payload?.sessionId) {
    try {
      await deleteSessionFromServer(payload.sessionId);
    } catch (error) {
      console.error("Erro ao invalidar sessão no servidor:", error);
    }
  }

  clearAuthData();

  if ("caches" in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.includes("auth"))
          .map((name) => caches.delete(name))
      );
    } catch {
      // Ignora erros de cache
    }
  }

  return { success: true };
}

export function shouldRefreshToken(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  return isJwtExpiringSoon(token);
}

/**
 * Renova o token se estiver próximo de expirar
 */
export function refreshTokenIfNeeded(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  const payload = verifyJwt(token);
  if (!payload) return false;

  if (isJwtExpiringSoon(token)) {
    const newToken = generateJwt(
      payload.sessionId,
      payload.accountId,
      payload.username
    );

    revokeToken(token);

    return storeAuthToken(newToken);
  }

  return true;
}

/**
 * Valida se uma requisição pode prosseguir
 */
export function validateAuthRequest(): {
  valid: boolean;
  sessionId?: string;
  error?: string;
} {
  const token = getAuthToken();

  if (!token) {
    return { valid: false, error: "Não autenticado" };
  }

  const payload = verifyJwt(token);
  if (!payload) {
    return { valid: false, error: "Token inválido ou expirado" };
  }

  return { valid: true, sessionId: payload.sessionId };
}

/**
 * Hook helper para obter o session_id de forma segura
 */
export function getSecureSessionId(): string | null {
  const authState = getAuthState();
  return authState.sessionId;
}
