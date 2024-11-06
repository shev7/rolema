const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" as const;

export const generateId = async (size: number) => {
  const { customAlphabet } = await import("nanoid");

  const nanoid = customAlphabet(alphabet, 8);

  return nanoid(size);
};
