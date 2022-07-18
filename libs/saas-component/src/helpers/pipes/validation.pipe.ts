import {
  HttpException,
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { responseRequest } from '../core/response-request';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const exception = await responseRequest({
        status: 'errorRequest',
        params: `${JSON.stringify(value)} `,
        data: errors ?? errors[0].constraints,
      });
      throw new HttpException(exception[0], exception[1]);
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(() => metatype === 'type');
  }
}
