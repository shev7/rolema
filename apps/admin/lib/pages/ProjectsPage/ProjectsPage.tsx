import { queryProjects } from "@utils/queries";
import { Content } from "./components";

export const ProjectsPage = async () => {
  const [projects] = await Promise.all([queryProjects()]);

  return <Content projects={projects} />;
};
