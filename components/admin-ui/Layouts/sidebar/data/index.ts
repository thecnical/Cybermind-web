import * as Icons from "../icons";
import type React from "react";

type NavSubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavSubItem[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

export const NAV_DATA: NavSection[] = [
  {
    label: "OVERVIEW",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: Icons.HomeIcon,
        items: [],
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        title: "Users",
        url: "/admin/users",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Support Tickets",
        url: "/admin/support",
        icon: Icons.Chat,
        items: [],
      },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      {
        title: "Revenue & Analytics",
        url: "/admin/charts/basic-chart",
        icon: Icons.PieChart,
        items: [],
      },
      {
        title: "Platform Tables",
        url: "/admin/tables",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Activity Calendar",
        url: "/admin/calendar",
        icon: Icons.Calendar,
        items: [],
      },
    ],
  },
  {
    label: "TEAM",
    items: [
      {
        title: "Team Chat",
        url: "/admin/team-chat",
        icon: Icons.Chat,
        items: [],
      },
      {
        title: "AI Chat",
        url: "/admin/ai-chat",
        icon: Icons.HomeIcon,
        items: [],
      },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      {
        title: "Platform Settings",
        url: "/admin/pages/settings",
        icon: Icons.FourCircle,
        items: [],
      },
      {
        title: "My Profile",
        url: "/admin/profile",
        icon: Icons.User,
        items: [],
      },
    ],
  },
];
