import { Provider } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { DatabaseFilter, HttpFilter, ZodFilter } from "./filters";
import { ResponseInterceptor } from "./interceptors";
import { ParametersGuard } from "./guards/parameters.guard";

export const commonProviders: Provider[] = [
  { provide: APP_FILTER, useClass: ZodFilter },
  { provide: APP_FILTER, useClass: HttpFilter },
  { provide: APP_FILTER, useClass: DatabaseFilter },
  { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  { provide: APP_GUARD, useClass: ParametersGuard },
];
