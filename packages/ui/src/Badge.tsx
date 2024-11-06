import {
  Badge as RadixBadge,
  BadgeProps as RadixBadgeProps,
} from "@radix-ui/themes";

export type BadgeProps = RadixBadgeProps;

export const Badge = (props: BadgeProps) => {
  return <RadixBadge size="2" {...props} />;
};
