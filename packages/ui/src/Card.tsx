import {
  Card as RadixCard,
  CardProps as RadixCardProps,
} from "@radix-ui/themes";

export type CardProps = RadixCardProps;

export const Card = (props: CardProps) => {
  return <RadixCard size="3" {...props} />;
};
