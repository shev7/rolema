import {
  Flex as RadixFlex,
  FlexProps as RadixFlexProps,
} from "@radix-ui/themes";
import { forwardRef } from "react";

export type FlexProps = RadixFlexProps;

export const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  return <RadixFlex {...props} ref={ref} />;
});
