import { PropsWithChildren } from "react";

import { Button, type ButtonProps } from "./Button";
import { Form } from "./Form";

export const SubmitButton = (props: PropsWithChildren<ButtonProps>) => {
  const {
    formState: { isDirty },
  } = Form.useFormContext();

  return (
    <Button type="submit" {...props} disabled={props.disabled || !isDirty} />
  );
};
