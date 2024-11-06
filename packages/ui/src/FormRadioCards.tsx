"use client";

import { Controller, useFormContext } from "react-hook-form";

import { RadioCards, RadioCardsProps } from "./RadioCards";
import { Field } from "./Field";

export type FormRadioCardsProps = Omit<RadioCardsProps, "name"> & {
  name: string;
  label?: string;
  options: Array<{ id: string; title: React.ReactNode }>;
};

export const FormRadioCards = ({
  name,
  options,
  label,
  style,
  id,
  ...props
}: FormRadioCardsProps) => {
  const { control } = useFormContext();

  return (
    <Field name={name} label={label} style={style} id={id}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <RadioCards
            size="2"
            name={name}
            value={value}
            onValueChange={(value) => {
              onChange(value);
              props.onValueChange?.(value);
            }}
            {...props}
          >
            {options.map(({ id, title }) => (
              <RadioCards.Item key={id} value={id}>
                {title}
              </RadioCards.Item>
            ))}
          </RadioCards>
        )}
      />
    </Field>
  );
};
