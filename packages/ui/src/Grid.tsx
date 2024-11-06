import {
  Grid as RadixGrid,
  GridProps as RadixGridProps,
} from "@radix-ui/themes";

export type GridProps = RadixGridProps;

export const Grid = (props: GridProps) => {
  return <RadixGrid {...props} />;
};
