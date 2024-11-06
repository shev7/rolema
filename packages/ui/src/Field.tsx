"use client";

import { CSSProperties, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import lodashGet from "lodash.get";

import { Label } from "@radix-ui/react-label";
import { TextField } from "@radix-ui/themes";

import { Typography } from "./Typography";

export type FieldProps = {
  name: string;
  label?: string;
  style?: CSSProperties;
  id?: string;
  children: ReactNode;
  description?: string;
  error?: string;
};

export const Field = ({
  name,
  label,
  style,
  id,
  children,
  description,
  error: errorProp,
}: FieldProps) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errorProp || lodashGet(errors, name)?.message;
  const hasError = Boolean(error);
  const errorMessage = String(error);

  return (
    <Label style={style} htmlFor={id ?? name}>
      {!!label && (
        <Typography
          size="2"
          weight="medium"
          style={{ display: "block" }}
          color={hasError ? "red" : undefined}
          mb="1"
        >
          {label}
        </Typography>
      )}
      {!!description && (
        <Typography size="1" style={{ display: "block" }} color="gray" mb="1">
          {description}
        </Typography>
      )}
      {children}
      {hasError && (
        <Typography as="span" color="red" size="2" mt="1">
          {errorMessage}
        </Typography>
      )}
    </Label>
  );
};

Field.Slot = TextField.Slot;
