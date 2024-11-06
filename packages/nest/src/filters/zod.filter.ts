import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { ZodError } from "zod";

import { errorResponse } from "./error-response.helper";

@Catch(ZodError)
export class ZodFilter<T extends ZodError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    errorResponse(host, {
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: "validation failed",
      errors: exception.errors,
    });
  }
}
