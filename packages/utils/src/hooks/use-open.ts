import { useState, useCallback } from "react";

export const useOpen = (defaultValue = false) => {
  const [open, setOpen] = useState(defaultValue);

  return [
    open,
    useCallback(() => setOpen(true), []),
    useCallback(() => setOpen(false), []),
    useCallback((value: boolean) => setOpen(value), []),
  ] as const;
};
