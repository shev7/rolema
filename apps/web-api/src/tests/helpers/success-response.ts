import { noop } from "./noop";

export const testSuccessResponse = <T>(data: T) => {
  return noop({
    data,
    error: null,
  });
};
