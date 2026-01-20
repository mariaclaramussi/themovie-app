import { z } from "zod";

// Schema para o payload do JWT
const jwtPayloadSchema = z.object({
  sessionId: z.string().min(1),
  accountId: z.string().optional(),
  username: z.string().optional(),
  iat: z.number(), // issued at (timestamp)
  exp: z.number(), // expiration (timestamp)
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

// Chave secreta para assinatura (em produção, usar variável de ambiente)
const JWT_SECRET = "themovie-app-secret-key-2024";
const TOKEN_EXPIRATION_HOURS = 24;

/**
 * Codifica uma string para Base64 URL-safe
 */
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Decodifica uma string Base64 URL-safe
 */
function base64UrlDecode(str: string): string {
  // Adiciona padding se necessário
  const padding = str.length % 4;
  if (padding) {
    str += "=".repeat(4 - padding);
  }
  return atob(str.replace(/-/g, "+").replace(/_/g, "/"));
}

/**
 * Cria uma assinatura HMAC-SHA256 simplificada
 * Nota: Em produção, usar Web Crypto API para assinatura real
 */
function createSignature(data: string, secret: string): string {
  // Implementação simplificada de hash para demonstração
  // Em produção, usar: await crypto.subtle.sign("HMAC", key, data)
  let hash = 0;
  const combined = data + secret;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return base64UrlEncode(Math.abs(hash).toString(16).padStart(16, "0"));
}

/**
 * Gera um JWT com os dados da sessão TMDB
 */
export function generateJwt(sessionId: string, accountId?: string, username?: string): string {
  const now = Math.floor(Date.now() / 1000);
  const expiration = now + TOKEN_EXPIRATION_HOURS * 60 * 60;

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload: JwtPayload = {
    sessionId,
    accountId,
    username,
    iat: now,
    exp: expiration,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = createSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifica e decodifica um JWT
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("JWT inválido: formato incorreto");
      return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    // Verifica a assinatura
    const expectedSignature = createSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
    if (signature !== expectedSignature) {
      console.warn("JWT inválido: assinatura não corresponde");
      return null;
    }

    // Decodifica o payload
    const payloadJson = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(payloadJson);

    // Valida com Zod
    const result = jwtPayloadSchema.safeParse(payload);
    if (!result.success) {
      console.warn("JWT inválido: payload malformado", result.error.message);
      return null;
    }

    // Verifica expiração
    const now = Math.floor(Date.now() / 1000);
    if (result.data.exp < now) {
      console.warn("JWT expirado");
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Erro ao verificar JWT:", error);
    return null;
  }
}

/**
 * Extrai o payload do JWT sem verificar (apenas para leitura rápida)
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson);

    const result = jwtPayloadSchema.safeParse(payload);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Verifica se o JWT está próximo de expirar (menos de 1 hora)
 */
export function isJwtExpiringSoon(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) return true;

  const now = Math.floor(Date.now() / 1000);
  const oneHourInSeconds = 60 * 60;

  return payload.exp - now < oneHourInSeconds;
}

/**
 * Retorna o tempo restante até expiração em segundos
 */
export function getJwtTimeRemaining(token: string): number {
  const payload = decodeJwtPayload(token);
  if (!payload) return 0;

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}
