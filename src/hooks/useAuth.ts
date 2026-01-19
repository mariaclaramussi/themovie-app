import { useState } from "react";
import { getValidSessionId } from "../schemas/session.schema";

export function useAuth() {
  const [sessionId] = useState<string | null>(() => getValidSessionId());

  const isAuthenticated = !!sessionId;

  return { sessionId, isAuthenticated };
}
