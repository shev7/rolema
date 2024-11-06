"use client";

import { Fragment } from "react";

import { useOpen } from "@repo/utils";

import { Controller, useFormContext } from "react-hook-form";
import lodashGet from "lodash.get";

import { Checkbox, ChevronDownIcon } from "@radix-ui/themes";

import { Flex, FlexProps } from "./Flex";
import { Field, FieldProps } from "./Field";
import { DropdownMenu } from "./DropdownMenu";
import { Typography } from "./Typography";
import { Button } from "./Button";
import { Cross2Icon } from "@radix-ui/react-icons";

export type MultiSelectProps = Omit<FieldProps, "children"> & {
  options: Array<{ id: string; title: string; separator?: boolean }>;
  placeholder?: string;
  wrapperProps?: FlexProps;
  onBeforeChange?: (oldValues: string[], value: string) => string[];
};

export const MultiSelect = ({
  label,
  description,
  name,
  options,
  placeholder,
  wrapperProps,
  style,
  id,
  onBeforeChange,
}: MultiSelectProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [open, onOpen, _onClose, onOpenChange] = useOpen();

  const error = lodashGet(errors, name)?.message;
  // TODO: use has error state on ui
  const _hasError = Boolean(error);

  return (
    <Field
      name={name}
      label={label}
      style={style}
      id={id}
      description={description}
    >
      <Controller
        control={control}
        name={name}
        render={({ field: { value: fieldValue, onChange } }) => {
          const value = fieldValue as Array<string>;
          const values = value
            .map((x) => options.find(({ id }) => id === x))
            .filter(Boolean) as MultiSelectProps["options"];

          return (
            <DropdownMenu open={open} onOpenChange={onOpenChange}>
              <DropdownMenu.Trigger>
                <Flex
                  className="rt-r-size-2 rt-reset rt-SelectTrigger rt-variant-surface"
                  role="button"
                  data-placeholder={values.length === 0}
                  gap="2"
                  tabIndex={0}
                  onClick={onOpen}
                  {...wrapperProps}
                  style={{
                    ...wrapperProps?.style,
                    padding: `${values.length ? 4 : 6}px 12px`,
                  }}
                >
                  {values.length === 0 && (
                    <span className="rt-SelectTriggerInner">{placeholder}</span>
                  )}
                  <Flex justify="start" align="center" wrap="wrap" gap="2">
                    {values.map(({ id, title }) => (
                      <Button key={id} variant="outline" size="1" tabIndex={-1}>
                        {title}
                      </Button>
                    ))}
                  </Flex>
                  <ChevronDownIcon className="rt-SelectIcon" />
                </Flex>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {options.map(({ id, title, separator }) => (
                  <Fragment key={id}>
                    <DropdownMenu.Item
                      onClick={() => {
                        const alreadySelected = value.find(
                          (option) => option === id,
                        );

                        const newValue = alreadySelected
                          ? value.filter((option) => option !== id)
                          : [...value, id];

                        onChange(
                          typeof onBeforeChange === "function"
                            ? onBeforeChange(value, id)
                            : newValue,
                        );
                      }}
                    >
                      <Flex gap="2" align="center">
                        <Checkbox checked={value.includes(id)} />
                        {title}
                      </Flex>
                    </DropdownMenu.Item>
                    {!!separator && <DropdownMenu.Separator />}
                  </Fragment>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu>
          );
        }}
      />
    </Field>
  );
};
