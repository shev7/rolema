import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { SuccessBody } from "@repo/types";

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessBody<T>>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessBody<T>> {
    return next.handle().pipe(map((data: T) => ({ data, error: null })));
  }
}
