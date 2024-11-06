import { noop } from "./noop";

export const testErrorResponse = <T>(error: T) => {
  return noop({
    data: null,
    error,
  });
};
