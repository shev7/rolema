import { Popover as RadixPopover } from "@radix-ui/themes";

export type PopoverProps = RadixPopover.RootProps;

export const Popover = (props: PopoverProps) => (
  <RadixPopover.Root {...props} />
);

Popover.Close = RadixPopover.Close;
Popover.Content = RadixPopover.Content;
Popover.Trigger = RadixPopover.Trigger;
