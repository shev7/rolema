import {
  Spinner as RadixSpinner,
  SpinnerProps as RadixSpinnerProps,
} from "@radix-ui/themes";

export type SpinnerProps = RadixSpinnerProps;

export const Spinner = (props: SpinnerProps) => {
  return <RadixSpinner {...props} />;
};
