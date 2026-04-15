import * as Icons from "../icons";

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

import type React from "react";

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
        title: "Revenue",
        url: "/admin/charts/basic-chart",
        icon: Icons.PieChart,
        items: [],
      },
    ],
  },
];
