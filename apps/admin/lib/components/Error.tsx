"use client";

import Link from "next/link";

import constants from "@repo/constants";
import { Button, Flex, Typography } from "@repo/ui";
import { useTranslation } from "@repo/i18n/hooks";

type ErrorProps = {
  error: Error;
  reset(): void;
};

export const Error = ({ error, reset }: ErrorProps) => {
  const { t } = useTranslation("common");

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="24px"
      p="32px"
    >
      <Typography color="red" weight="bold" size="8">
        {t("error occured")}
      </Typography>
      <Typography color="red" weight="medium" size="7">
        {error.message}
      </Typography>
      <Flex gap="10px" align="center">
        <Button onClick={reset}>{t("try again")}</Button>
        <Button variant="outline" asChild>
          <Link href={constants.nav.routes.home} prefetch={false}>
            {t("home")}
          </Link>
        </Button>
      </Flex>
    </Flex>
  );
};
