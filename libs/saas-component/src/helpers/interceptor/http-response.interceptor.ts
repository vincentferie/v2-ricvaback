import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseHttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (
      context.switchToHttp().getResponse().getHeaders()['content-type'] ==
      'application/pdf'
    ) {
      return next.handle();
    }
    return next.handle().pipe(
      map((value) => {
        let exec: any;
        if (Array.isArray(value)) {
          exec = value;
        } else {
          exec = [
            {
              response: {
                state: 405,
                message: 'Request error!',
                data: value,
              },
            },
            405,
          ];
        }
        if (value == undefined) {
          exec = [
            {
              response: {
                state: 405,
                message: 'Undefined return!',
                data: value,
              },
            },
            405,
          ];
        }
        throw new HttpException(exec[0], exec[1]);
      }),
    );
  }
}
