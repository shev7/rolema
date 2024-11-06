import {
  IconButton as RadixIconButton,
  IconButtonProps as RadixIconButtonProps,
} from "@radix-ui/themes";
import { forwardRef } from "react";

export type IconButtonProps = RadixIconButtonProps;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    return <RadixIconButton size="2" {...props} ref={ref} />;
  },
);
