import { Callout as RadixCallout } from "@radix-ui/themes";

export type CalloutProps = RadixCallout.RootProps;

export const Callout = (props: CalloutProps) => (
  <RadixCallout.Root {...props} />
);

Callout.Icon = RadixCallout.Icon;
Callout.Text = RadixCallout.Text;
