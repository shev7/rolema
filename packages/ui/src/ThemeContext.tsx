"use client";
import { Theme, ThemeProps } from "@radix-ui/themes";

export type ThemeContextProps = ThemeProps;

export const ThemeContext = (props: ThemeContextProps) => {
  return <Theme {...props} />;
};
