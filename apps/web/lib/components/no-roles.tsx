import { Callout, Flex, InfoCircledIcon } from "@repo/ui";
import { CreateProjectRoleModal } from "./create-project-role-modal";

export const NoRoles = ({ projectId }: { projectId: string }) => {
  return (
    <Flex
      m="auto"
      direction="column"
      gap="6"
      justify="center"
      height="100%"
      maxWidth="400px"
    >
      <Callout color="gray">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          No roles have been created yet. Start your jorney by creating one.
          <br />
          <br />
          You can create up to 5 roles in your project. If you want more talk to
          your project coordinator.
        </Callout.Text>
      </Callout>
      <CreateProjectRoleModal projectId={projectId} />
    </Flex>
  );
};
