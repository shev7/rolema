import {
  Text as RadixTypography,
  TextProps as RadixTextProps,
} from "@radix-ui/themes";

export type TypographyProps = RadixTextProps;

export const Typography = (props: TypographyProps) => {
  return <RadixTypography size="2" {...props} />;
};
