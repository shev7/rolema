"use client";

import { ComponentProps, ReactNode, FormEvent } from "react";
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";

type FormProps<T extends FieldValues> = Omit<
  ComponentProps<"form">,
  "onSubmit"
> & {
  values?: T;
  defaultValues?: DefaultValues<T>;
  schema?: ZodType<T>;
  children: ReactNode;
  onSubmit?: SubmitHandler<T>;
  onInvalid?: SubmitErrorHandler<T>;
};

export const Form = <T extends FieldValues>({
  schema,
  defaultValues,
  children,
  onSubmit,
  onInvalid,
  values,
  ...props
}: FormProps<T>) => {
  const methods = useForm({
    values,
    defaultValues,
    resolver: schema ? zodResolver(schema) : undefined,
    shouldUseNativeValidation: false,
  });

  const handleSubmit = (event: FormEvent) => {
    event.stopPropagation();
    onSubmit && methods.handleSubmit(onSubmit, onInvalid)(event);
  };

  return (
    <FormProvider {...methods}>
      <form
        aria-errormessage={methods.formState.errors.root?.message}
        onSubmit={handleSubmit}
        noValidate
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
};

Form.useFormContext = useFormContext;
