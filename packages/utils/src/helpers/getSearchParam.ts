export const getSearchParam = (
  seacrhParams: Record<string, string | string[] | undefined>,
  key: string,
): string[] => {
  const value = seacrhParams[key];

  if (Array.isArray(value)) return value;

  return typeof value === "string" ? [value] : [];
};
