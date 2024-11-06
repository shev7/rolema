"use client";

import { PropsWithChildren, useCallback, useState } from "react";

import * as RadixToast from "@radix-ui/react-toast";

import { createContext } from "../utils/createContex";
import { Toast, ToastProps } from "../Toast";
import "../Toast.styles.css";

type ToastConfig = Omit<ToastProps, "variant">;

type ToasterContextValue = {
  success(toast: ToastConfig): void;
  error(toast: ToastConfig): void;
};

const [ToastContext, useToastContext] = createContext<ToasterContextValue>(
  null as unknown as ToasterContextValue,
);

export const useToast = useToastContext;

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const success = useCallback<ToasterContextValue["success"]>((toast) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { ...toast, key: prevToasts.length + 1, variant: "success" },
    ]);
  }, []);

  const error = useCallback<ToasterContextValue["error"]>(
    (toast: ToastConfig) => {
      setToasts((prevToasts) => [
        ...prevToasts,
        { ...toast, key: prevToasts.length + 1, variant: "error" },
      ]);
    },
    [],
  );

  return (
    <ToastContext success={success} error={error}>
      <RadixToast.Provider>
        {toasts.map((toast, index) => (
          <Toast
            key={toast.key}
            {...toast}
            duration={5000 * (toasts.length - index)}
          />
        ))}
        <RadixToast.Viewport className="ToastViewport" />
      </RadixToast.Provider>
      {children}
    </ToastContext>
  );
};
