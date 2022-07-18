import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { isDefined, isUUID } from 'class-validator';
// import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { cleanUp } from '../../functions/cleanup.function';
import { clean } from '../../constants';
import { responseRequest } from '../../core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JwtSecretKey'),
    });
  }

  async validate(req, payload: JwtPayload): Promise<any> {
    let cleanPayload: any;
    const { id, role_id } = payload.data;

    if (!isDefined(id) && !isUUID(role_id)) {
      const exception = responseRequest({
        status: 'unAutorized',
        data: null,
        params: `Les données de l'utilisateur sont manquantes.`,
      });
      return new HttpException(exception[0], exception[1]);
    }
    if (isDefined(payload.data.role)) {
      const role = cleanUp(payload.data.role, clean);
      delete payload.data.role;
      const other = payload.data;
      cleanPayload = { ...other, role: role };
    } else {
      cleanPayload = cleanUp(payload.data, clean);
    }
    return cleanPayload;
  }
}
