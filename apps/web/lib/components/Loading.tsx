import { Flex, Spinner } from "@repo/ui";
import { Zoom } from "./zoom";

export const Loading = () => {
  return (
    <Flex
      align="center"
      justify="center"
      width="100%"
      height="100%"
      flexShrink="1"
    >
      <Zoom duration={300} style={{ scale: 1.25 }}>
        <Spinner size="3" />
      </Zoom>
    </Flex>
  );
};
