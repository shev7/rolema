import Link from "next/link";

import { Project, ProjectRole } from "@repo/database";
import {
  Badge,
  Box,
  Card,
  Flex,
  GearIcon,
  Heading,
  IconButton,
  Typography,
} from "@repo/ui";
import constants from "@repo/constants";

import { ProjectStatus } from "@components/ProjectStatus";

export const ProjectCard = ({
  id,
  name,
  description,
  status,
  projectRole,
  isOwner,
}: Pick<Project, "id" | "name" | "description"> & {
  status?: Project["status"];
  projectRole?: ProjectRole;
  isOwner?: boolean;
}) => (
  <Box width="100%" maxWidth="20rem">
    <Card asChild>
      <Flex direction="column" gap="4">
        <Flex direction="column" gap="2">
          <Flex align="center" justify="between">
            <Flex gap="4">
              <Link
                href={constants.nav.routes.project(
                  id,
                  status !== "ready" ? status : undefined,
                )}
              >
                <Heading size="4">{name}</Heading>
              </Link>
              {!!status && (
                <Box>
                  <ProjectStatus status={status} />
                </Box>
              )}
            </Flex>

            {isOwner && (
              <IconButton variant="ghost" size="2" color="gray" asChild>
                <Link href={constants.nav.routes.projectSettings(id)}>
                  <GearIcon />
                </Link>
              </IconButton>
            )}
          </Flex>
          <Typography size="1" mt="2">
            {description}
          </Typography>
        </Flex>

        {!!projectRole && (
          <Box>
            <Badge color="bronze">{projectRole.name}</Badge>
          </Box>
        )}
      </Flex>
    </Card>
  </Box>
);
