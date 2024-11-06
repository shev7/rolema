import {
  Heading as RadixHeading,
  HeadingProps as RadixHeadingProps,
} from "@radix-ui/themes";

export type HeadingProps = RadixHeadingProps;

export const Heading = (props: HeadingProps) => <RadixHeading {...props} />;
