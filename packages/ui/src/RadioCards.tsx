import { RadioCards as RadixRadioCards } from "@radix-ui/themes";

export type RadioCardsProps = RadixRadioCards.RootProps;

export const RadioCards = (props: RadioCardsProps) => (
  <RadixRadioCards.Root {...props} />
);

RadioCards.Item = RadixRadioCards.Item;
