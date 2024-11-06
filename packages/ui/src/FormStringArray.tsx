"use client";

import { useFieldArray, useFormContext } from "react-hook-form";

import { useTranslation } from "@repo/i18n/hooks";

import { Field, FieldProps } from "./Field";
import { FormInput } from "./FormInput";
import { Button } from "./Button";
import { Flex } from "./Flex";
import { IconButton } from "./IconButton";
import { TrashIcon } from "@radix-ui/react-icons";

export type FormStringArrayProps = Omit<FieldProps, "children">;

export const FormStringArray = ({
  name,
  label,
  style,
  id,
}: FormStringArrayProps) => {
  const { register, control } = useFormContext();

  const { fields, append, remove } = useFieldArray({ control, name });

  const { t } = useTranslation();

  return (
    <Field name={name} label={label} style={style} id={id}>
      <Flex direction="column" gap="4">
        {fields.map((field, index) => (
          <Flex key={field.id} gap="4">
            <FormInput {...register(`${name}.${index}`)} style={{ flex: 1 }} />
            <IconButton
              color="red"
              variant="outline"
              type="button"
              onClick={() => remove(index)}
            >
              <TrashIcon />
            </IconButton>
          </Flex>
        ))}
        <Button type="button" onClick={() => append("")}>
          {t("add")}
        </Button>
      </Flex>
    </Field>
  );
};
