import { TabNav as RadixTabNav } from "@radix-ui/themes";

export type TabNavProps = RadixTabNav.RootProps;

export const TabNav = (props: TabNavProps) => <RadixTabNav.Root {...props} />;

TabNav.Link = RadixTabNav.Link;
