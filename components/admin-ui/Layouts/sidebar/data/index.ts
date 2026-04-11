import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "OPERATIONS",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          { title: "Overview", url: "/admin" },
        ],
      },
      {
        title: "Calendar",
        url: "/admin/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Profile",
        url: "/admin/profile",
        icon: Icons.User,
        items: [],
      },
    ],
  },
  {
    label: "DATA",
    items: [
      {
        title: "Tables",
        url: "/admin/tables",
        icon: Icons.Table,
        items: [
          { title: "Data Tables", url: "/admin/tables" },
        ],
      },
      {
        title: "Forms",
        icon: Icons.Alphabet,
        items: [
          { title: "Form Elements", url: "/admin/forms/form-elements" },
          { title: "Form Layout", url: "/admin/forms/form-layout" },
        ],
      },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          { title: "Basic Chart", url: "/admin/charts/basic-chart" },
        ],
      },
      {
        title: "UI Elements",
        icon: Icons.FourCircle,
        items: [
          { title: "Alerts", url: "/admin/ui-elements/alerts" },
          { title: "Buttons", url: "/admin/ui-elements/buttons" },
        ],
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "Pages",
        icon: Icons.Alphabet,
        items: [
          { title: "Settings", url: "/admin/pages/settings" },
          { title: "Error 404", url: "/admin/pages/error-404" },
        ],
      },
      {
        title: "Auth",
        icon: Icons.Authentication,
        items: [
          { title: "Sign In", url: "/auth/login" },
        ],
      },
    ],
  },
];
