import { useState } from "react";

export function useAuth() {
  const [sessionId, _] = useState<string | null>(() =>
    localStorage.getItem("session_id")
  );

  const isAuthenticated = !!sessionId;

  return { sessionId, isAuthenticated };
}
