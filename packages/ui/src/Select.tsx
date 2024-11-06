"use client";

import { Controller, useFormContext } from "react-hook-form";
import lodashGet from "lodash.get";

import { Select as RadixSelect } from "@radix-ui/themes";

import { FlexProps } from "./Flex";
import { Field, FieldProps } from "./Field";

export type SelectProps = Omit<RadixSelect.RootProps, "name"> &
  Omit<FieldProps, "children"> & {
    options: Array<{ id: string; title: React.ReactNode }>;
    placeholder?: string;
    wrapperProps?: FlexProps;
  };

export const Select = ({
  children,
  label,
  name,
  options,
  placeholder,
  wrapperProps,
  style,
  id,
  ...props
}: SelectProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = lodashGet(errors, name)?.message;
  const hasError = Boolean(error);

  return (
    <Field name={name} label={label} style={style} id={id}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <RadixSelect.Root
            size="2"
            name={name}
            {...props}
            value={value}
            disabled={options.length < 2}
            onValueChange={(value) => {
              onChange(value);
              props.onValueChange?.(value);
            }}
          >
            <RadixSelect.Trigger
              id={name}
              placeholder={placeholder}
              color={hasError ? "red" : undefined}
              style={{ width: "100%" }}
            />
            <RadixSelect.Content>
              <RadixSelect.Group>
                {options.map(({ id, title }) => (
                  <RadixSelect.Item key={id} value={id}>
                    {title}
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Group>
            </RadixSelect.Content>
            {children}
          </RadixSelect.Root>
        )}
      />
    </Field>
  );
};
