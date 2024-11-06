"use client";

import { useFormContext } from "react-hook-form";
import lodashGet from "lodash.get";

import { TextField } from "@radix-ui/themes";

import { Field, FieldProps } from "./Field";

export type FormInputProps = TextField.RootProps & Omit<FieldProps, "children">;

export const FormInput = ({
  name,
  label,
  style,
  id,
  error: errorProp,
  onChange,
  onBlur,
  ...props
}: FormInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errorProp || lodashGet(errors, name)?.message;
  const hasError = Boolean(error);

  return (
    <Field name={name} label={label} style={style} id={id} error={errorProp}>
      <TextField.Root
        size="2"
        id={id ?? name}
        color={hasError ? "red" : undefined}
        autoComplete="off"
        {...props}
        {...register(name, {
          onChange,
          onBlur,
          setValueAs: (v) => (props.type === "date" ? new Date(v) : v),
        })}
      />
    </Field>
  );
};

FormInput.Slot = TextField.Slot;
