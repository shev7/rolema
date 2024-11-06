import {
  Tooltip as RadixTooltip,
  TooltipProps as RadixTooltipProps,
} from "@radix-ui/themes";

export type TooltipProps = RadixTooltipProps;

export const Tooltip = (props: TooltipProps) => {
  return <RadixTooltip {...props} />;
};
