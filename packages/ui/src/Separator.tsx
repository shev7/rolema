import {
  Separator as RadixSeparator,
  SeparatorProps as RadixSeparatorProps,
} from "@radix-ui/themes";

export type SeparatorProps = RadixSeparatorProps;

export const Separator = (props: SeparatorProps) => {
  return <RadixSeparator {...props} />;
};
