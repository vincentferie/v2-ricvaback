import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { isDefined } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { accountsPattern, authPattern } from '../../constants/suscribe.pattern';
import { Sending } from '../../functions/requesting';
import { RefreshTokensDto } from '../../dto';
import { responseRequest } from '../../core';
import { msATH } from '../../constants';

@Injectable()
export class JwtRefreshToken extends PassportStrategy(
  Strategy,
  'jwtRefreshtoken',
) {
  constructor(
    private readonly config: ConfigService,
    @Inject(msATH) private readonly clientService: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: true,
      secretOrKey: config.get<string>('JwtSecretKey'),
    });
  }

  async validate(req, payload: any) {
    try {
      let tokenRefresh: any;
      let userMakingRequest: any;
      const headers = {
        // userAgent: req.headers['user-agent'],
        tenantHead: req.headers['access-code'],
        tenantId: req.headers['access-tenant'],
        clientIp: req.clientIp,
        // route: req.route,
        // other: {
        //   host: req.headers.host,
        //   url: req.url,
        //   method: req.method,
        // },
      };
      if (isDefined(req.user)) {
        userMakingRequest = {
          id: req.user?.id,
          role: req.user?.role.id,
          name: `${req.user?.prenoms} ${req.user?.nom}`,
        };
      } else {
        userMakingRequest = false;
      }
      const data = {
        body: req.body,
        file: req?.file,
        param: payload.data.id,
        query: req.query,
        user: userMakingRequest,
      };

      tokenRefresh = await Sending(
        { headers: headers, payload: data },
        this.clientService,
        accountsPattern[10],
      ); //await this.refreshRepository.findTokenById(payload.data.id);

      if (!isDefined(tokenRefresh)) {
        return responseRequest({
          status: 'unAutorized',
          data: null,
          params: `L'utilisateur n'existe pas ou le token de rafraichissement est revoqué.`,
        });
      }
      if (req.body.refreshToken != tokenRefresh.token) {
        return responseRequest({
          status: 'unAutorized',
          data: null,
          params: `Le token pour rafraichir n'existe pas en base`,
        });
      }
      if (new Date() > new Date(tokenRefresh.expires)) {
        // Block token
        const newdata = {
          body: {
            id: tokenRefresh.id,
            user_id: tokenRefresh.user_id,
            is_revoked: true,
          } as RefreshTokensDto,
          file: req?.file,
          param: payload.data.id,
          query: req.query,
          user: userMakingRequest,
        };
        tokenRefresh = await Sending(
          { headers: headers, payload: newdata },
          this.clientService,
          authPattern[1],
        ); //await this.refreshRepository.updateRefreshToken(input);

        return responseRequest({
          status: 'unAutorized',
          data: null,
          params: `Le delai de rafraichissement prevu est échu.`,
        });
      }
      if (tokenRefresh.is_revoked === true) {
        return responseRequest({
          status: 'unAutorized',
          data: null,
          params: `Le token est revoqué.`,
        });
      }
      return [payload, tokenRefresh];
    } catch (e) {
      return responseRequest({
        status: 'unAutorized',
        data: e,
        params: `Erreur d'accès.`,
      });
    }
  }
}
