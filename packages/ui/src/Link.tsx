import {
  Link as RadixLink,
  LinkProps as RadixLinkProps,
} from "@radix-ui/themes";

export type LinkProps = RadixLinkProps;

export const Link = (props: LinkProps) => {
  return <RadixLink size="2" {...props} />;
};
