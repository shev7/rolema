import Link from "next/link";
import { cookies } from "next/headers";

import {
  Box,
  DropdownMenu,
  Flex,
  IconButton,
  PersonIcon,
  Typography,
  ChangeLanguageDropdownItem,
} from "@repo/ui";
import { getServerTranslations } from "@repo/i18n";
import { getSession } from "@repo/utils";
import constants from "@repo/constants";
import { languages } from "@repo/i18n/constants";

import { logout } from "@actions/logout";

export const Header = async () => {
  const { t, i18n } = await getServerTranslations("common");
  const { t: adminT } = await getServerTranslations("admin");

  const session = await getSession(cookies());

  return (
    <header>
      <Box p="6">
        <Flex justify="between" align="center">
          <Typography weight="bold" size="8">
            <Link href={constants.nav.routes.home} prefetch={false}>
              {t("admin")}
            </Link>
          </Typography>
          {!!session.user_id && (
            <DropdownMenu>
              <DropdownMenu.Trigger>
                <IconButton variant="ghost">
                  <PersonIcon />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item asChild>
                  <Link
                    href={constants.config.WEB_APP_URL}
                    target="_blank"
                    prefetch={false}
                  >
                    {adminT("web")}
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>
                    {t("language")} [{i18n.resolvedLanguage}]
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent>
                    {languages.map((language) => (
                      <ChangeLanguageDropdownItem
                        key={language}
                        language={language}
                      />
                    ))}
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>

                <DropdownMenu.Separator />

                <form action={logout}>
                  <DropdownMenu.Item color="red" asChild>
                    <button type="submit" style={{ width: "100%" }}>
                      {t("logout")}
                    </button>
                  </DropdownMenu.Item>
                </form>
              </DropdownMenu.Content>
            </DropdownMenu>
          )}
        </Flex>
      </Box>
    </header>
  );
};
