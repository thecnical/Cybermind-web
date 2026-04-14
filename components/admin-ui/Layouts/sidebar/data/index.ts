import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          { title: "Overview", url: "/admin" },
        ],
      },
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
