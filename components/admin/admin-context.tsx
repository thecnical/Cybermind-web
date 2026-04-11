"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  type AdminRole,
  getDefaultSectionForRole,
  getNavForRole,
  roleDescriptions,
  roleLabels,
} from "@/lib/mock-data";

interface AdminDemoContextValue {
  role: AdminRole;
  setRole: (role: AdminRole) => void;
  roleLabel: string;
  roleDescription: string;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const AdminDemoContext = createContext<AdminDemoContextValue | null>(null);

const STORAGE_KEY = "cybermind-admin-role";

export function AdminDemoProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<AdminRole>(() => {
    if (typeof window === "undefined") {
      return "boss";
    }
    const storedRole = window.localStorage.getItem(STORAGE_KEY) as AdminRole | null;
    return storedRole && getNavForRole(storedRole).length > 0 ? storedRole : "boss";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const value = useMemo<AdminDemoContextValue>(
    () => ({
      role,
      setRole: (nextRole) => {
        window.localStorage.setItem(STORAGE_KEY, nextRole);
        setRoleState(nextRole);
      },
      roleLabel: roleLabels[role],
      roleDescription: roleDescriptions[role],
      sidebarOpen,
      setSidebarOpen,
    }),
    [role, sidebarOpen],
  );

  return <AdminDemoContext.Provider value={value}>{children}</AdminDemoContext.Provider>;
}

export function useAdminDemo() {
  const context = useContext(AdminDemoContext);
  if (!context) {
    throw new Error("useAdminDemo must be used within AdminDemoProvider");
  }

  return context;
}

export { getDefaultSectionForRole };
