import { TextField as RadixTextField } from "@radix-ui/themes";

export type TextFieldProps = RadixTextField.RootProps;

export const TextField = (props: TextFieldProps) => {
  return <RadixTextField.Root size="2" {...props} />;
};
