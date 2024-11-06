"use client";

import * as RadixToast from "@radix-ui/react-toast";
import { CheckIcon, InfoCircledIcon } from "@radix-ui/react-icons";

import { Flex } from "./Flex";

import "./Toast.styles.css";
import { Box } from "./Box";

export type ToastProps = Omit<RadixToast.ToastProps, "title"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "success" | "error";
};

export const Toast = ({
  title,
  description,
  variant,
  ...props
}: ToastProps) => {
  return (
    <RadixToast.Root className="ToastRoot" {...props}>
      <RadixToast.Title className="ToastTitle">
        <Flex align="center" gap="2">
          {variant === "success" && <CheckIcon />}
          {variant === "error" && <InfoCircledIcon />}
          {title}
        </Flex>
      </RadixToast.Title>
      {!!description && (
        <RadixToast.Description asChild>{description}</RadixToast.Description>
      )}
    </RadixToast.Root>
  );
};
