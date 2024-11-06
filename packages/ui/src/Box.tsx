import { Box as RadixBox, BoxProps as RadixBoxProps } from "@radix-ui/themes";
import React from "react";

export type BoxProps = RadixBoxProps;

export const Box = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return <RadixBox {...props} ref={ref} />;
});
