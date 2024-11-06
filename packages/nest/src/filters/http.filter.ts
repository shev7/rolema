import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";

import { errorResponse } from "./error-response.helper";

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    errorResponse(host, {
      statusCode: exception.getStatus(),
      message: exception.message,
    });
  }
}
