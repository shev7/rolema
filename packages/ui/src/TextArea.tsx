"use client";

import { useFormContext } from "react-hook-form";
import lodashGet from "lodash.get";

import {
  TextArea as RadixTextArea,
  TextAreaProps as RadixTextAreaProps,
} from "@radix-ui/themes";

import { Field, FieldProps } from "./Field";

export type TextAreaProps = Omit<RadixTextAreaProps, "name"> &
  Omit<FieldProps, "children">;

export const TextArea = ({
  name,
  style,
  label,
  id,
  ...props
}: TextAreaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = lodashGet(errors, name)?.message;
  const hasError = Boolean(error);

  return (
    <Field name={name} label={label} style={style} id={id}>
      <RadixTextArea
        size="2"
        id={id ?? name}
        color={hasError ? "red" : undefined}
        autoComplete="off"
        style={{ minHeight: "132px" }}
        {...props}
        {...register(name)}
      />
    </Field>
  );
};
