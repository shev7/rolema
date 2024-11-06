import { Fragment } from "react";
import Link from "next/link";

import { Flex } from "./Flex";
import { Typography } from "./Typography";
import { Box } from "./Box";

type BreadcrumbLink = { href: string; title: string };

export type BreadcrumbsProps = {
  links: [BreadcrumbLink, ...BreadcrumbLink[]];
};

export const Breadcrumbs = ({ links }: BreadcrumbsProps) => {
  if (links.length === 0) {
    throw new Error("Breadcrumbs links are not provided");
  }

  return (
    <Flex gap="2" align="start">
      {links.map(({ href, title }, index) => (
        <Fragment key={href + title}>
          <Box>
            <Link href={href} prefetch={false}>
              <Typography size="1" weight="regular">
                {title}
              </Typography>
            </Link>
          </Box>
          {index !== links.length - 1 && (
            <Box>
              <Typography size="1" weight="regular">
                /
              </Typography>
            </Box>
          )}
        </Fragment>
      ))}
    </Flex>
  );
};
