import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  catchError,
  Observable,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import { responseRequest } from '../core';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(120000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          // return throwError(() => new RequestTimeoutException());
          return responseRequest({
            status: 'timeout',
            data: {},
            params: {},
          });
        }
        return throwError(() => new Error());
      }),
    );
  }
}

// import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
// import { Observable, throwError } from 'rxjs';
// import { RpcException } from '@nestjs/microservices';

// @Catch(RpcException)
// export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
//   catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
//     return throwError(() => exception.getError());
//   }
// }