import { updateProjectRolePermissionsSchema } from "../schemas";

describe("schemas", () => {
  describe("updateProjectRolePermissionsSchema", () => {
    const parse = (
      permissions: Array<
        | {
            key: string;
            project_id: string;
          }
        | {
            key: string;
            project_role_id: string;
          }
      >,
    ) => {
      updateProjectRolePermissionsSchema.parse({
        permissions,
      });
    };

    it("works", () => {
      expect(() => parse([])).not.toThrow();
      expect(() =>
        parse([{ key: "role:read", project_id: "test" }]),
      ).not.toThrow();
      expect(() =>
        parse([
          { key: "role:invite", project_id: "test" },
          { key: "role:read", project_id: "test" },
        ]),
      ).not.toThrow();
      expect(() =>
        parse([{ key: "role:invite", project_role_id: "testtest" }]),
      ).not.toThrow();
      expect(() =>
        parse([
          { key: "role:read", project_role_id: "testtest" },
          { key: "role:read", project_role_id: "tsettset" },
          { key: "role:invite", project_role_id: "testtest" },
          { key: "role:invite", project_role_id: "tsettset" },
        ]),
      ).not.toThrow();
    });

    it("fails", () => {
      expect(() =>
        parse([{ key: "incorrect key", project_id: "test" }]),
      ).toThrow();
      expect(() =>
        parse([
          { key: "role:read", project_id: "test" },
          { key: "role:read", project_id: "test" },
        ]),
      ).toThrow();
      expect(() =>
        parse([
          { key: "role:read", project_id: "test" },
          { key: "role:read", project_role_id: "testtest" },
        ]),
      ).toThrow();
      expect(() =>
        parse([
          { key: "role:invite", project_id: "test" },
          { key: "role:read", project_role_id: "testtest" },
          { key: "role:invite", project_role_id: "testtest" },
        ]),
      ).toThrow();
    });
  });
});
