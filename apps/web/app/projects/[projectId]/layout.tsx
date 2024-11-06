import { Header } from "@components/header";
import { ProjectUser } from "@repo/database";
import { NextLayoutProps } from "@repo/types";

const SubLayout = async ({
  children,
  params: { projectId },
}: NextLayoutProps<{ projectId: ProjectUser["project_id"] }>) => {
  return (
    <>
      <Header projectId={projectId} />
      {children}
    </>
  );
};

export default SubLayout;
