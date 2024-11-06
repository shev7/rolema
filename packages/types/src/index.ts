import { CookieOptions } from "express";
import { PropsWithChildren } from "react";
import constants from "@repo/constants";

export type T<Q> = Q;

export type LoginResponse = {
  session: string;
  options: CookieOptions;
};

export type RegisterResponse = {
  email: string;
};

export type CookieStore = {
  get: (name: string) =>
    | {
        name: string;
        value: string;
      }
    | undefined;
  set: (name: string, value: string, cookie?: Partial<CookieOptions>) => void;
};

export type ApiError<T = unknown> = {
  statusCode: number;
  endpoint?: string;
  message?: string;
  errors?: T[];
};

export type Body<TData, TError = unknown> = {
  data: TData;
  error: ApiError<TError>;
};

export type SuccessBody<TData = unknown> = Omit<Body<TData>, "error"> & {
  error: null;
};

export type ErrorBody<TError = unknown> = Body<null, TError>;

export type NextPageProps<
  SearchParams extends Record<string, string | string[]> = {},
  Params extends Record<string, string | string[]> = {},
> = {
  searchParams: SearchParams;
  params: Params;
};

export type NextLayoutProps<
  Params extends Record<string, string | string[]> = {},
> = PropsWithChildren<{
  params: Params;
}>;

export type Sort =
  (typeof constants.nav.sp.sort)[keyof typeof constants.nav.sp.sort];

export type CountResponse = {
  count: number;
};

export type TierDuration =
  (typeof constants.database.tier.day_durations)[number];

export type Currency = (typeof constants.common.currency)[number];
