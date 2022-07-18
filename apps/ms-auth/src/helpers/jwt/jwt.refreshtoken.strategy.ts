import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { isDefined } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenRepository } from '../../apps/auth/refresh-token/refresh-token.repository';
import { responseRequest } from '@app/saas-component/helpers/core';
import { RefreshTokensDto } from '@app/saas-component/helpers';

@Injectable()
export class JwtRefreshToken extends PassportStrategy(
  Strategy,
  'jwtRefreshtoken',
) {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(RefreshTokenRepository)
    private readonly refreshRepository: RefreshTokenRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: true,
      secretOrKey: config.get<string>('JwtSecretKey'),
    });
  }

  async validate(req, payload: any) {
    const tokenRefresh = await this.refreshRepository.findTokenById(
      payload.data.id,
    );

    if (!isDefined(tokenRefresh)) {
      const exception = await responseRequest({
        status: 'unAutorized',
        data: null,
        params: `L'utilisateur n'existe pas ou le token de rafraichissement est revoqué.`,
      });
      throw new HttpException(exception[0], exception[1]);
    }
    if (req.body.refreshToken != tokenRefresh.token) {
      const exception = await responseRequest({
        status: 'unAutorized',
        data: null,
        params: `Le token pour rafraichir n'existe pas en base`,
      });
      throw new HttpException(exception[0], exception[1]);
    }
    if (new Date() > new Date(tokenRefresh.expires)) {
      // Block token
      const input = {
        id: tokenRefresh.id,
        user_id: tokenRefresh.user_id,
        is_revoked: true,
      } as RefreshTokensDto;
      await this.refreshRepository.updateRefreshToken(input);
      const exception = await responseRequest({
        status: 'unAutorized',
        data: null,
        params: `Le delai de rafraichissement prevu est échu.`,
      });
      throw new HttpException(exception[0], exception[1]);
    }
    if (tokenRefresh.is_revoked === true) {
      const exception = await responseRequest({
        status: 'unAutorized',
        data: null,
        params: `Le token est revoqué.`,
      });
      throw new HttpException(exception[0], exception[1]);
    }
    return [payload, tokenRefresh];
  }
}
