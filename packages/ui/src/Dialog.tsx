import { Dialog as RadixDialog } from "@radix-ui/themes";

export type DialogProps = RadixDialog.RootProps;

export const Dialog = (props: DialogProps) => <RadixDialog.Root {...props} />;

Dialog.Trigger = RadixDialog.Trigger;
Dialog.Content = RadixDialog.Content;
Dialog.Title = RadixDialog.Title;
Dialog.Description = RadixDialog.Description;
Dialog.Close = RadixDialog.Close;
