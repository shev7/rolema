import {
  Button as RadixButton,
  ButtonProps as RadixButtonProps,
} from "@radix-ui/themes";
import { forwardRef } from "react";

export type ButtonProps = RadixButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <RadixButton size="2" {...props} ref={ref} />;
  },
);
