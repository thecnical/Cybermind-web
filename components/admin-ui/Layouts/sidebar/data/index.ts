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
      {
        title: "Forms",
        icon: Icons.Alphabet,
        items: [
          { title: "Form Elements", url: "/admin/forms/form-elements" },
          { title: "Form Layout", url: "/admin/forms/form-layout" },
        ],
      },
      {
        title: "Tables",
        url: "/admin/tables",
        icon: Icons.Table,
        items: [
          { title: "Tables", url: "/admin/tables" },
        ],
      },
    ],
  },
  {
    label: "OTHERS",
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
];
