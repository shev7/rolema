"use client";

import { useState } from "react";

import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import { FormInput, FormInputProps } from "./FormInput";
import { IconButton } from "./IconButton";

export const PasswordInput = (
  props: Omit<FormInputProps, "name"> & { name?: string },
) => {
  const [passwordFieldType, setPasswordFieldType] = useState<
    "password" | "text"
  >("password");

  return (
    <FormInput name="password" {...props} type={passwordFieldType}>
      <FormInput.Slot side="right">
        <IconButton
          size="1"
          variant="ghost"
          type="button"
          onClick={() =>
            setPasswordFieldType((state) =>
              state === "password" ? "text" : "password",
            )
          }
        >
          {passwordFieldType === "password" ? (
            <EyeOpenIcon color="gray" />
          ) : (
            <EyeClosedIcon color="gray" />
          )}
        </IconButton>
      </FormInput.Slot>
    </FormInput>
  );
};
