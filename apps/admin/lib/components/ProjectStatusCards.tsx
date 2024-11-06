import { useTranslation } from "@repo/i18n/hooks";
import { Flex, FormRadioCards } from "@repo/ui";
import constants from "@repo/constants";

type ProjectStatusCardsProps = {
  label?: string;
};

export const ProjectStatusCards = ({ label }: ProjectStatusCardsProps) => {
  const { t } = useTranslation();

  const statuses = constants.database.project.project_status
    .filter((id) => id !== "pending")
    .map((id) => ({
      id,
      title: t(id),
    }));

  return (
    <Flex direction="column">
      <FormRadioCards
        label={label}
        columns={{ initial: "2", sm: "2" }}
        options={statuses}
        name="status"
      />
    </Flex>
  );
};
