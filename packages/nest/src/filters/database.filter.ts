import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import { DatabaseError } from "pg";

import { errorResponse } from "./error-response.helper";

@Catch(DatabaseError)
export class DatabaseFilter implements ExceptionFilter {
  catch(exception: DatabaseError, host: ArgumentsHost) {
    errorResponse(host, {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
    });
  }
}
