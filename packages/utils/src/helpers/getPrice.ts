import { Currency } from "@repo/types";

const currencySigns: Record<Currency, string> = {
  BYN: "BYN",
  USD: "$",
  EUR: "€",
} as const;

export const getPrice = (
  cents: number,
  { currency }: { currency: Currency } = { currency: "USD" },
) => {
  return `${Math.round(cents / 100)} ${currencySigns[currency]}`;
};
