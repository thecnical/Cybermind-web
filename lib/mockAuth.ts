import type { PlanTier } from "@/lib/mockData";

export const MOCK_AUTH_STORAGE_KEY = "cybermind_cli_mock_session";
export const MOCK_AUTH_EVENT = "cybermind-auth-change";

export type MockSession = {
  authenticated: boolean;
  name: string;
  email: string;
  avatar: string;
  plan: PlanTier;
};

export const defaultMockSession: MockSession = {
  authenticated: false,
  name: "Chandan Pandey",
  email: "chandan@cybermind.dev",
  avatar: "CP",
  plan: "free",
};

export function readMockSession(): MockSession {
  if (typeof window === "undefined") {
    return defaultMockSession;
  }

  const raw = window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY);
  if (!raw) {
    return defaultMockSession;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<MockSession>;
    return {
      ...defaultMockSession,
      ...parsed,
      authenticated: Boolean(parsed.authenticated),
    };
  } catch {
    return defaultMockSession;
  }
}

function emitAuthChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(MOCK_AUTH_EVENT));
}

export function writeMockSession(session: MockSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(session));
  emitAuthChange();
}

export function clearMockSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
  emitAuthChange();
}

export function avatarFromName(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "CM"
  );
}
