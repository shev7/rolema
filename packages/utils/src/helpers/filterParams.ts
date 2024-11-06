export const filterParams = <T extends string>(
  rawParams: string[],
  fromCollection: readonly T[],
): T[] => [
  ...new Set(
    rawParams.filter((param): param is T =>
      fromCollection.includes(param as T),
    ),
  ),
];
