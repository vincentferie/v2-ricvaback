import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { responseRequest } from '../core/response-request';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err, user, info, context) {
    let exception;
    if (!err) {
      if (err.name === 'TokenExpiredError') {
        exception = responseRequest({
          status: 'unAutorized',
          data: 'Since ' + err.expiredAt,
          params: err.message,
        });
      } else if (err.name === 'JsonWebTokenError') {
        exception = responseRequest({
          status: 'unAutorized',
          data: null,
          params: err.message,
        });
      } else if (err.name === 'NotBeforeError') {
        exception = responseRequest({
          status: 'unAutorized',
          data: 'This current date ' + err.date + ' is before the nbf claim',
          params: err.message,
        });
      } else {
        exception = responseRequest({
          status: 'unAutorized',
          data: err.message,
          params: `Imposible to read this token statut ${err.status}. Contact Dev team.`,
        });
      }
      throw new Error(exception);
    }

    if (!info) {
      exception = responseRequest({
        status: 'unAutorized',
        data: info,
        params: 'Imposible to read this token. Contact Dev team.',
      });
      throw new Error(exception);
    }

    if (!user) {
      exception = responseRequest({
        status: 'unAutorized',
        data: null,
        params: `Imposible to read this token statut ${err.status}. Contact Dev team.`,
      });
      throw new Error(exception);
    }

    return user;
  }
}
