import { useState, useEffect, useCallback } from "react";
import {
  getAuthState,
  refreshTokenIfNeeded,
  shouldRefreshToken,
  AuthState,
} from "../services/authService";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => getAuthState());

  // Atualiza o estado de autenticação
  const refreshAuth = useCallback(() => {
    setAuthState(getAuthState());
  }, []);

  // Verifica e renova o token periodicamente
  useEffect(() => {

    if (shouldRefreshToken()) {
      refreshTokenIfNeeded();
      refreshAuth();
    }

    //Verifica a cada 5 min. Se expirar, nao pode ser renovado
    const interval = setInterval(() => {
      if (shouldRefreshToken()) {
        const refreshed = refreshTokenIfNeeded();
        if (!refreshed) {
          refreshAuth();
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshAuth]);

  // Escuta mudanças no storage -> logout em outra aba
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "auth_token" || event.key === "logout_timestamp") {
        refreshAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshAuth]);

  return {
    sessionId: authState.sessionId,
    isAuthenticated: authState.isAuthenticated,
    accountId: authState.accountId,
    username: authState.username,
    expiresIn: authState.expiresIn,
    refreshAuth,
  };
}
