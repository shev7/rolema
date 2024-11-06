import React from "react";

type ContextProvider<Props> = React.MemoExoticComponent<
  (props: React.PropsWithChildren<Props>) => JSX.Element
>;
type UseContextHook<T> = () => T;

export const createContext = <T,>(
  defaultValue: T,
): [ContextProvider<T>, UseContextHook<T>] => {
  const Ctx = React.createContext<T>(defaultValue);

  const useContext = () => React.useContext(Ctx);

  const Provider = React.memo(
    ({ children, ...props }: React.PropsWithChildren<T>) => {
      return <Ctx.Provider value={props as T}>{children}</Ctx.Provider>;
    },
  );

  return [Provider, useContext];
};
