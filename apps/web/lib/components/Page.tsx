import { ReactNode } from "react";

import { Box, Flex, FlexProps, Heading } from "@repo/ui";

import { Slide } from "./slide";

export const Page = ({ children }: { children: ReactNode }) => (
  <Box height="100vh" position="relative">
    <Box
      style={{
        paddingTop: "104px",
        maxHeight: "100%",
        overflowY: "hidden",
        display: "flex",
        position: "relative",
        height: "100vh",
      }}
    >
      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
    </Box>
  </Box>
);

const PageTitle = async ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => (
  <Flex
    justify="between"
    align="center"
    width="100%"
    style={{
      boxShadow: "inset 0 -1px 0 0 var(--gray-a5)",
      backgroundColor: "var(--background-accent)",
    }}
  >
    <Flex
      direction="row"
      py="8"
      gap="4"
      justify="between"
      align="center"
      px="6"
      maxWidth="1200px"
      width="100%"
      mx="auto"
    >
      <Slide duration={300} direction="left">
        <Heading size="6" weight="bold">
          {title}
        </Heading>
      </Slide>
      {children}
    </Flex>
  </Flex>
);

const PageContent = (
  props: { children: ReactNode } & Omit<FlexProps, "children">,
) => (
  <Flex
    px="6"
    py="6"
    flexGrow="1"
    className="PageContentWithMenu"
    maxWidth="1200px"
    width="100%"
    mx="auto"
    {...props}
  />
);

const PageContentWithMenu = ({
  children,
  aside,
}: {
  children: ReactNode;
  aside: ReactNode;
}) => (
  <PageContent>
    <Flex gap="6" flexGrow="1" maxWidth="1200px" mx="auto" width="100%">
      <PageAside>{aside}</PageAside>
      <div style={{ flex: 1 }}>{children}</div>
    </Flex>
  </PageContent>
);

const PageAside = ({ children }: { children: ReactNode }) => (
  <aside style={{ minWidth: "200px" }}>{children}</aside>
);

Page.Title = PageTitle;
Page.Content = PageContent;
Page.Aside = PageAside;
Page.ContentWithMenu = PageContentWithMenu;
