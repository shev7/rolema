"use client";

import { useParams, usePathname, useRouter } from "next/navigation";

import { TabNav } from "@repo/ui";
import constants from "@repo/constants";
import { Tier } from "@repo/database";

type TierPageTabsProps = {
  informationTabTitle: string;
};

export const TierPageTabs = ({ informationTabTitle }: TierPageTabsProps) => {
  const router = useRouter();
  const { tierId } = useParams<{ tierId: Tier["id"] }>();
  const pathname = usePathname();

  const page = pathname.split("/").at(-1);
  const isActiveInfoPage = page === "info";
  const tierInfoHref = constants.nav.routes.tierInfo(tierId);

  return (
    <TabNav style={{ width: "100%" }}>
      <TabNav.Link
        href={tierInfoHref}
        onClick={(event) => {
          event.preventDefault();
          router.push(tierInfoHref);
        }}
        active={isActiveInfoPage}
      >
        {informationTabTitle}
      </TabNav.Link>
    </TabNav>
  );
};
