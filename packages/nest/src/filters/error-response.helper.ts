import { ArgumentsHost, HttpStatus } from "@nestjs/common";
import { Response, Request } from "express";

import { ErrorBody } from "@repo/types";

type Options<TError> = {
  errors?: TError[];
  message: string;
  statusCode: HttpStatus;
};

export const errorResponse = <TError>(
  host: ArgumentsHost,
  { errors, message, statusCode }: Options<TError>,
) => {
  const ctx = host.switchToHttp();
  const request = ctx.getRequest<Request>();
  const response = ctx.getResponse<Response<ErrorBody<TError>>>();

  response.status(statusCode).send({
    data: null,
    error: {
      errors,
      message,
      statusCode,
      endpoint: `${request.method} ${request.path}`,
    },
  });
};
