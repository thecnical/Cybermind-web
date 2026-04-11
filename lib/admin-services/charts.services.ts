export async function getDevicesUsedData(timeFrame?: string) {
  await new Promise((r) => setTimeout(r, 500));
  const data = [
    { name: "Desktop", percentage: 0.65, amount: timeFrame === "yearly" ? 19500 : 1625 },
    { name: "Tablet",  percentage: 0.10, amount: timeFrame === "yearly" ? 3000  : 250  },
    { name: "Mobile",  percentage: 0.20, amount: timeFrame === "yearly" ? 6000  : 500  },
    { name: "Unknown", percentage: 0.05, amount: timeFrame === "yearly" ? 1500  : 125  },
  ];
  return data;
}

export async function getPaymentsOverviewData(timeFrame?: string) {
  await new Promise((r) => setTimeout(r, 500));
  if (timeFrame === "yearly") {
    return {
      received: [{ x: 2020, y: 450 }, { x: 2021, y: 620 }, { x: 2022, y: 780 }, { x: 2023, y: 920 }, { x: 2024, y: 1080 }],
      due:      [{ x: 2020, y: 1480 }, { x: 2021, y: 1720 }, { x: 2022, y: 1950 }, { x: 2023, y: 2300 }, { x: 2024, y: 1200 }],
    };
  }
  return {
    received: [
      { x: "Jan", y: 0 }, { x: "Feb", y: 20 }, { x: "Mar", y: 35 }, { x: "Apr", y: 45 },
      { x: "May", y: 35 }, { x: "Jun", y: 55 }, { x: "Jul", y: 65 }, { x: "Aug", y: 50 },
      { x: "Sep", y: 65 }, { x: "Oct", y: 75 }, { x: "Nov", y: 60 }, { x: "Dec", y: 75 },
    ],
    due: [
      { x: "Jan", y: 15 }, { x: "Feb", y: 9 }, { x: "Mar", y: 17 }, { x: "Apr", y: 32 },
      { x: "May", y: 25 }, { x: "Jun", y: 68 }, { x: "Jul", y: 80 }, { x: "Aug", y: 68 },
      { x: "Sep", y: 84 }, { x: "Oct", y: 94 }, { x: "Nov", y: 74 }, { x: "Dec", y: 62 },
    ],
  };
}

export async function getWeeksProfitData(timeFrame?: string) {
  await new Promise((r) => setTimeout(r, 500));
  if (timeFrame === "last week") {
    return {
      sales:   [{ x: "Sat", y: 33 }, { x: "Sun", y: 44 }, { x: "Mon", y: 31 }, { x: "Tue", y: 57 }, { x: "Wed", y: 12 }, { x: "Thu", y: 33 }, { x: "Fri", y: 55 }],
      revenue: [{ x: "Sat", y: 10 }, { x: "Sun", y: 20 }, { x: "Mon", y: 17 }, { x: "Tue", y: 7  }, { x: "Wed", y: 10 }, { x: "Thu", y: 23 }, { x: "Fri", y: 13 }],
    };
  }
  return {
    sales:   [{ x: "Sat", y: 44 }, { x: "Sun", y: 55 }, { x: "Mon", y: 41 }, { x: "Tue", y: 67 }, { x: "Wed", y: 22 }, { x: "Thu", y: 43 }, { x: "Fri", y: 65 }],
    revenue: [{ x: "Sat", y: 13 }, { x: "Sun", y: 23 }, { x: "Mon", y: 20 }, { x: "Tue", y: 8  }, { x: "Wed", y: 13 }, { x: "Thu", y: 27 }, { x: "Fri", y: 15 }],
  };
}

export async function getCampaignVisitorsData() {
  await new Promise((r) => setTimeout(r, 500));
  return {
    total_visitors: 784_000,
    performance: -1.5,
    chart: [
      { x: "S", y: 168 }, { x: "S", y: 385 }, { x: "M", y: 201 },
      { x: "T", y: 298 }, { x: "W", y: 187 }, { x: "T", y: 195 }, { x: "F", y: 291 },
    ],
  };
}

export async function getVisitorsAnalyticsData() {
  await new Promise((r) => setTimeout(r, 500));
  return [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112, 123, 212, 270,
    190, 310, 115, 90, 380, 112, 223, 292, 170, 290, 110, 115, 290, 380, 312,
  ].map((value, index) => ({ x: String(index + 1), y: value }));
}
