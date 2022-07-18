import { HttpException } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { responseRequest } from '../core/response-request';

@Injectable()
export class ParseJsonPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    const val = JSON.parse(value);

    if (typeof val === 'object') {
      const exception = await responseRequest({
        status: 'errorRequest',
        params: `${JSON.stringify(value)} n'est pas au format JSON`,
        data: value,
      });
      throw new HttpException(exception[0], exception[1]);
    }
    return val;
  }
}
