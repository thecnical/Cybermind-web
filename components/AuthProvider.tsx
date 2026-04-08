"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  MOCK_AUTH_EVENT,
  clearMockSession,
  readMockSession,
  type MockSession,
} from "@/lib/mockAuth";
import { mockUser, type PlanTier } from "@/lib/mockData";

type AuthUser = {
  id: string;
  email: string;
};

type AuthProfile = {
  id: string;
  email: string;
  full_name: string;
  plan: PlanTier;
  requests_today: number;
  requests_month: number;
  created_at: string;
  avatar: string;
};

type AuthContextType = {
  user: AuthUser | null;
  session: MockSession | null;
  profile: AuthProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

const REQUESTS_BY_PLAN: Record<PlanTier, { today: number; month: number }> = {
  free: { today: mockUser.requestsToday, month: mockUser.requestsMonth },
  pro: { today: 52, month: 974 },
  elite: { today: 188, month: 5120 },
};

function buildAuthState(session: MockSession) {
  if (!session.authenticated) {
    return { user: null, profile: null };
  }

  const usage = REQUESTS_BY_PLAN[session.plan];
  return {
    user: {
      id: `mock-${session.email.toLowerCase()}`,
      email: session.email,
    },
    profile: {
      id: `mock-${session.email.toLowerCase()}`,
      email: session.email,
      full_name: session.name,
      plan: session.plan,
      requests_today: usage.today,
      requests_month: usage.month,
      created_at: "2026-01-01T00:00:00.000Z",
      avatar: session.avatar,
    },
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialSession = readMockSession();
  const [loading] = useState(false);
  const [session, setSession] = useState<MockSession | null>(initialSession);
  const [{ user, profile }, setState] = useState(() => buildAuthState(initialSession));

  function applySession(next: MockSession) {
    setSession(next);
    setState(buildAuthState(next));
  }

  useEffect(() => {
    function onAuthChange() {
      applySession(readMockSession());
    }

    function onStorage(event: StorageEvent) {
      if (event.key?.includes("cybermind_cli_mock_session")) {
        applySession(readMockSession());
      }
    }

    window.addEventListener(MOCK_AUTH_EVENT, onAuthChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(MOCK_AUTH_EVENT, onAuthChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  async function signOut() {
    clearMockSession();
    applySession(readMockSession());
  }

  async function refreshProfile() {
    applySession(readMockSession());
  }
  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

