export const formURL = (
  pathname: string,
  originalURL: string,
  searchParams?: Array<[string, string] | [] | boolean>,
) => {
  const url = new URL(pathname, originalURL);

  if (Array.isArray(searchParams)) {
    for (const param of searchParams) {
      if (Array.isArray(param) && param.length === 2) {
        url.searchParams.append(param[0], param[1]);
      }
    }
  }

  return url;
};
