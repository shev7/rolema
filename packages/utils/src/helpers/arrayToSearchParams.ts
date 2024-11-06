export const arrayToSearchParams = (
  params: string[],
  key: string,
  ...otherParams: Array<[string, string] | undefined>
) =>
  new URLSearchParams([
    ...params.map((param) => [key, param]),
    ...((otherParams.filter(Boolean) as Array<[string, string]>) ?? []),
  ]);
