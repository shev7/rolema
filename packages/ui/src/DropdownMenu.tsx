import { DropdownMenu as RadixDropdownMenu } from "@radix-ui/themes";

export const DropdownMenu = (props: RadixDropdownMenu.RootProps) => (
  <RadixDropdownMenu.Root {...props} />
);

DropdownMenu.Trigger = RadixDropdownMenu.Trigger;
DropdownMenu.TriggerIcon = RadixDropdownMenu.TriggerIcon;
DropdownMenu.Content = RadixDropdownMenu.Content;
DropdownMenu.Item = RadixDropdownMenu.Item;
DropdownMenu.Separator = RadixDropdownMenu.Separator;
DropdownMenu.Sub = RadixDropdownMenu.Sub;
DropdownMenu.SubTrigger = RadixDropdownMenu.SubTrigger;
DropdownMenu.SubContent = RadixDropdownMenu.SubContent;
