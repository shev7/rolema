import { Flex, Spinner } from "@repo/ui";

export const Loading = () => {
  return (
    <Flex align="center" justify="center" width="100%" height="100%">
      <Spinner size="3" />
    </Flex>
  );
};
