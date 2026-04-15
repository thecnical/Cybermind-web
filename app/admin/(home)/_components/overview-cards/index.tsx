import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { totalUsers, activeKeys, eliteUsers, revenue } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Users"
        data={{
          ...totalUsers,
          value: compactFormat(totalUsers.value),
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Active Keys"
        data={{
          ...activeKeys,
          value: compactFormat(activeKeys.value),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Elite Members"
        data={{
          ...eliteUsers,
          value: compactFormat(eliteUsers.value),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Revenue"
        data={{
          ...revenue,
          value: "$" + compactFormat(revenue.value),
        }}
        Icon={icons.Profit}
      />
    </div>
  );
}
