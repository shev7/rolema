"use client";

import { useEffect } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Project } from "@repo/database";
import {
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
  DropdownMenu,
  Flex,
  Typography,
  CheckIcon,
  Box,
} from "@repo/ui";
import constants from "@repo/constants";

import { changeProjectCookie } from "@actions/change-project-cookie";

import "@radix-ui/themes/styles.css";

export const HeaderTitle = ({
  projects,
  projectCookie,
}: {
  projectCookie?: string;
  projects: Array<Pick<Project, "id" | "name" | "status">>;
}) => {
  const { projectId } = useParams<{ projectId?: string }>();

  const project = projects.find(({ id }) => id === projectId);

  useEffect(() => {
    if (project && project.id !== projectCookie) {
      changeProjectCookie(project.id);
    }
  }, [projectCookie, project]);

  if (projects.length > 1) {
    return (
      <>
        <style>{`.Trigger:not(:hover) { background-color: transparent; }`}</style>
        <DropdownMenu>
          <DropdownMenu.Trigger>
            <Button
              variant="soft"
              color={!project || project.status === "ready" ? "gray" : "red"}
              size="2"
              className="Trigger"
            >
              <Flex align="center" gap="4">
                <Typography weight="bold">
                  {project?.name ?? "Rolema"}
                </Typography>
                <Flex direction="column" align="center">
                  <ChevronUpIcon height="8" width="8" />
                  <ChevronDownIcon height="8" width="8" />
                </Flex>
              </Flex>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {projects.map(({ id, name, status }) => (
              <Link
                key={id}
                href={
                  status !== "ready"
                    ? constants.nav.routes.projectSettings(id)
                    : constants.nav.routes.project(id)
                }
                onClick={() => changeProjectCookie(id)}
              >
                <DropdownMenu.Item
                  disabled={id === projectId}
                  color={status !== "ready" ? "red" : undefined}
                >
                  <Flex gap="2" justify="between" align="center" width="100%">
                    {name}
                    {id === projectId && <CheckIcon />}
                  </Flex>
                </DropdownMenu.Item>
              </Link>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu>
      </>
    );
  }

  return (
    <Box py="1">
      <Link href={constants.nav.routes.home}>
        <Typography weight="bold">{projects[0]?.name ?? "Rolema"}</Typography>
      </Link>
    </Box>
  );
};
