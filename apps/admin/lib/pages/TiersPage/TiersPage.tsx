import { Content } from "./components";
import { queryTiers } from "@utils/queries";

export const TiersPage = async () => {
  const tiers = await queryTiers();

  return <Content tiers={tiers} />;
};
