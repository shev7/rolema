"use client";

import { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button, Flex } from "@repo/ui";
import { Slide } from "@components/slide";

export const Menu = ({
  options,
}: {
  options: Array<{
    href: string;
    title: ReactNode;
  }>;
}) => {
  const pathname = usePathname();

  return (
    <Flex direction="column" gap="2" position="sticky" top="6">
      <style>{`.Link:not(:hover) { background-color: transparent; }`}</style>
      {options.map(({ href, title }, index) => (
        <Slide key={href} duration={300} delay={50 * index}>
          <Button
            variant="soft"
            color={pathname === href ? "blue" : "gray"}
            size="2"
            className="Link"
            asChild
          >
            <Link
              href={href}
              style={{
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              {title}
            </Link>
          </Button>
        </Slide>
      ))}
    </Flex>
  );
};
