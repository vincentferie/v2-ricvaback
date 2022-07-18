import {
  clean,
  clean1,
  roles,
  tableIndex,
  tablesParamCashew,
  tablesParamPublic,
} from '@app/saas-component/helpers/constants';
import { responseRequest } from '@app/saas-component/helpers/core';
import {
  AuthCredentialsDto,
  RefreshTokensDto,
} from '@app/saas-component/helpers/dto';
import {
  cleanUp,
  getNgxPermissionRole,
} from '@app/saas-component/helpers/functions';
import {
  IRmqInput,
  IRmqPayloadHeader,
  QueryParam,
} from '@app/saas-component/helpers/interfaces';
import { MainComponentService } from '@app/saas-component/settings/main-component/main-component.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { isDefined, UUIDVersion } from 'class-validator';
import { randomBytes } from 'crypto';
import * as randtoken from 'rand-token';
import * as bcrypt from 'bcrypt';
import { Connection, MoreThan, Repository } from 'typeorm';
import { TENANT_CONNECTION } from '../../helpers/providers/tenant.provider';
import { AccountEntity } from './account/account.entity';
import {
  AccountCredentialsModel,
  AuthCredentialsModel,
  SetupDBModel,
} from './auth-credentials.model';
import { BruteForceEntity } from './brute-force/brute-force.entity';
import { RefreshTokenEntity } from './refresh-token/refresh-token.entity';
import { RoleEntity } from '../roles/role.entity';
import { TenantDatabaseService } from '../../helpers/services/init-table.service';

@Injectable()
export class AuthService {
  private repository: Repository<AccountEntity>;
  private refreshRepository: Repository<RefreshTokenEntity>;
  private bruteForceRepository: Repository<BruteForceEntity>;
  private roleRepository: Repository<RoleEntity>;
  private connectionOk = true;

  constructor(
    @Inject(TENANT_CONNECTION) private readonly connection: Connection,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mainComponent: MainComponentService,
    private readonly tenancyDatatableSetup: TenantDatabaseService,
  ) {
    if (connection == undefined) {
      this.connectionOk = false;
    } else {
      this.repository = connection.getRepository(AccountEntity);
      this.roleRepository = connection.getRepository(RoleEntity);
      this.bruteForceRepository = connection.getRepository(BruteForceEntity);
      this.refreshRepository = connection.getRepository(RefreshTokenEntity);
    }
  }

  async signin(
    input: IRmqInput<AuthCredentialsModel>,
    headerInfo: IRmqPayloadHeader,
  ): Promise<any> {
    let result: any, exception: any;

    if (this.connectionOk) {
      try {
        const user_id = await this.validateUserPassword(input.value);
        // Brute force check
        if (await this.bruteForce(user_id, 'check')) {
          return await responseRequest({
            status: 'unAutorized',
            data: null,
            params: `Le nombre de tentative est atteint. Réessayez ultérieurement!`,
          });
        }

        if (!isDefined(user_id)) {
          await this.bruteForce(user_id, 'set');
          return await responseRequest({
            status: 'unAutorized',
            data: null,
            params: `Information incorrecte ${JSON.stringify(
              input.value.username,
            )} ou ${JSON.stringify(input.value.password)}.`,
          });
        }
        const payload = await this.repository.findOne({
          select: ['id', 'nom', 'prenoms'],
          join: {
            alias: 'account',
            leftJoinAndSelect: {
              role: 'account.role',
            },
          },
          withDeleted: false,
          where: { id: user_id },
        });
        cleanUp(payload, clean);
        cleanUp(payload.role, clean);

        const accessToken = await this.jwtService.signAsync(
          { data: payload },
          {
            audience: this.config.get<string>('JwtAudience'), // Signature
            issuer: this.config.get<string>('JwtIssuer'), // Issuer
            jwtid: Buffer.from(randomBytes(12)).toString('base64'), // Json Token Id: an unique identifier for the token
            notBefore: 0, // Not before
            expiresIn: this.config.get<number>('JwtOptionExpiresIn'),
            algorithm: this.config.get('JwtOptionAlgorithm'),
            secret: this.config.get<string>('JwtSecretKey'),
          },
        );
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setMinutes(
          today.getSeconds() +
            this.config.get<number>('JwtOptionExpiresIn') / 1000,
        );

        // Client Information
        const customer = await this.mainComponent.customer(headerInfo.tenantId);
        cleanUp(customer, clean1);
        cleanUp(customer.logo, clean1);

        // Tenant Access App

        const appAccess = await this.mainComponent.appAccess(
          headerInfo.tenantId,
        );
        const urlInfo = [];
        for (const item of appAccess.appList) {
          urlInfo.push({ id: item.url.id, url: item.url.url });
        }

        result = {
          accessToken: accessToken,
          type: 'Bearer',
          refreshToken: await this.genRefreshToken(user_id, tomorrow),
          rules:
            payload.role !== null
              ? getNgxPermissionRole(roles, payload.role.id)
              : null,
          appAccess: urlInfo,
          clientInfo: customer,
        };

        exception = await responseRequest({
          status: 'authenticate',
          data: result,
          params: Object.keys(result || {}).length,
        });
      } catch (error) {
        if (error.code === '22P02') {
          exception = await responseRequest({
            status: 'errorFound',
            data: result,
            params: error.message,
          });
        } else {
          exception = await responseRequest({
            status: 'errorOtherRequest',
            data: error,
            params: `Erreur de paramètre url ${JSON.stringify(input.value)}`,
          });
        }
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: {},
      });
    }
    return exception;
  }

  async findTokenById(user: string): Promise<RefreshTokenEntity | null> {
    try {
      return this.refreshRepository.findOne({
        where: { user_id: user, is_revoked: false },
        withDeleted: false,
      });
    } catch (error) {
      throw Error(error);
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<UUIDVersion | null> {
    const { username, password } = authCredentialsDto;
    const user = await this.repository.findOne({
      where: { username: username },
      withDeleted: false,
    });
    cleanUp(user, clean);

    if (user && (await user.validatePassword(password))) {
      return user.id;
    } else {
      return null;
    }
  }

  async genRefreshToken(userId: UUIDVersion, expiresIn): Promise<string> {
    let exception;

    try {
      const refreshToken = randtoken.generate(128);
      const input = {
        user_id: userId,
        is_revoked: false,
        expires: expiresIn,
        token: refreshToken,
      } as RefreshTokensDto;
      await this.createRefreshTokenFn(input);
      return refreshToken;
    } catch (error) {
      exception = await responseRequest({
        status: 'unAutorized',
        data: error,
        params: error.detail,
      });
    }

    throw new HttpException(exception[0], exception[1]);
  }

  async refreshToken(request: any): Promise<any> {
    let result: any, exception: any;
    try {
      const payload = await this.repository.findOne({
        select: ['id', 'nom', 'prenoms'],
        join: {
          alias: 'account',
          leftJoinAndSelect: {
            role: 'account.role',
          },
        },
        where: { id: request.user.id },
        withDeleted: false,
      });
      cleanUp(payload, clean);
      cleanUp(payload.role, clean);

      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setMinutes(today.getMinutes() + 15);

      const accessToken = await this.jwtService.signAsync(
        { data: payload },
        {
          audience: this.config.get<string>('JwtAudience'), // Signature
          issuer: this.config.get<string>('JwtIssuer'), // Issuer
          jwtid: Buffer.from(randomBytes(12)).toString('base64'), // Json Token Id: an unique identifier for the token
          notBefore: 0, // Not before
          expiresIn: this.config.get<number>('JwtOptionExpiresIn'),
          algorithm: this.config.get('JwtOptionAlgorithm'),
          secret: this.config.get<string>('JwtSecretKey'),
        },
      );

      result = {
        accessToken: accessToken,
        type: 'Bearer',
        refreshToken: await this.updateRefreshToken(request.auth.id, tomorrow),
        rules:
          payload.role !== null
            ? getNgxPermissionRole(roles, payload.role.id)
            : null,
      };

      exception = await responseRequest({
        status: 'authenticate',
        data: result,
        params: {},
      });
    } catch (error) {
      exception = await responseRequest({
        status: 'unAutorized',
        data: null,
        params: error.detail,
      });
    }

    throw new HttpException(exception[0], exception[1]);
  }

  async updateRefreshToken(id: UUIDVersion, expiresIn): Promise<string> {
    try {
      const refreshToken = randtoken.generate(128);
      const input = {
        id: id,
        is_revoked: false,
        expires: expiresIn,
        token: refreshToken,
      } as RefreshTokensDto;
      await this.updateRefreshTokenFn(input);
      return refreshToken;
    } catch (error) {
      throw Error(error);
    }
  }

  async createRefreshTokenFn(
    credentialsDto: RefreshTokensDto,
  ): Promise<RefreshTokenEntity> {
    // const { user_id, is_revoked, expires, token } = credentialsDto;
    try {
      return this.refreshRepository.save(credentialsDto);
    } catch (e) {
      throw Error(e);
    }
  }

  async updateRefreshTokenFn(credentialsDto: RefreshTokensDto) {
    const { id, is_revoked, token } = credentialsDto;
    let found;
    try {
      found = await this.refreshRepository.findOne({
        where: { id: id },
        withDeleted: false,
      });

      if (isDefined(found)) {
        found.is_revoked = is_revoked;
        found.token = token;
        await found.save();
      }
    } catch (error) {
      throw Error(error);
    }
  }

  async bruteForce(user_id: UUIDVersion, type: string) {
    // remove two hours at now datetime
    const today = new Date();
    today.setHours(today.getHours() - 2);

    let result: any, total: number;
    try {
      if (type == 'check') {
        [result, total] = await this.bruteForceRepository.findAndCount({
          select: ['times'],
          where: {
            user: user_id,
            times: MoreThan(today),
          },
        });
        return total > 4 ? true : false;
      } else if (type == 'set') {
        await this.bruteForceRepository.save({
          user: user_id,
          times: Date.now(),
        });
      }
    } catch (e) {
      throw Error(e);
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async initialization(credentialsDto: IRmqInput<AccountCredentialsModel>) {
    let result: any, exception: any;

    if (this.connectionOk) {
      try {
        const userToken: string = credentialsDto.value.token;
        const valideToken = await this.mainComponent.tokenValidation(userToken);

        if (!isDefined(valideToken)) {
          return await responseRequest({
            status: 'unAutorized',
            data: null,
            params: `Invalide Token ${userToken} `,
          });
        }
        if (!valideToken.initialized) {
          return await responseRequest({
            status: 'errorUpdated',
            data: null,
            params: `Ce token ${userToken} devra être validé avant tout accès!`,
          });
        } else {
          // Gen Salt
          const salt = await bcrypt.genSalt();
          credentialsDto.value.password = await this.hashPassword(
            credentialsDto.value.password,
            salt,
          );
          // Set Rules
          let roleCount = 0;
          for await (const element of roles) {
            const output: any = { id: element.id, libelle: element.libelle };
            await this.roleRepository.save(output);
            roleCount++;
          }

          // Set account data and save
          let payload: any;
          if (roleCount > 0) {
            const data = {
              ...credentialsDto.value,
              salt: salt,
              role_id: 'fe931208-2e32-46ef-970a-7ac954b9f30c',
            };
            payload = await this.repository.save(data as any);
          }
          if (isDefined(payload)) {
            const accessToken = await this.jwtService.signAsync(
              { data: payload },
              {
                audience: this.config.get<string>('JwtAudience'), // Signature
                issuer: this.config.get<string>('JwtIssuer'), // Issuer
                jwtid: Buffer.from(randomBytes(12)).toString('base64'), // Json Token Id: an unique identifier for the token
                notBefore: 0, // Not before
                expiresIn: this.config.get<number>('JwtOptionExpiresIn'),
                algorithm: this.config.get('JwtOptionAlgorithm'),
                secret: this.config.get<string>('JwtSecretKey'),
              },
            );
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setMinutes(
              today.getSeconds() +
                this.config.get<number>('JwtOptionExpiresIn') / 1000,
            );
            result = {
              accessToken: accessToken,
              type: 'Bearer',
              refreshToken: await this.genRefreshToken(payload.id, tomorrow),
              rules:
                payload.role_id !== null
                  ? getNgxPermissionRole(roles, payload.role_id)
                  : null,
            };
          }
        }
        exception = await responseRequest({
          status: 'authenticate',
          data: result,
          params: Object.keys(result || {}).length,
        });
      } catch (error) {
        if (error.code === '22P02') {
          exception = await responseRequest({
            status: 'errorFound',
            data: result,
            params: error.message,
          });
        } else {
          exception = await responseRequest({
            status: 'errorOtherRequest',
            data: error.TypeError,
            params: `Erreur de paramètre url ${JSON.stringify(
              credentialsDto.value,
            )}`,
          });
        }
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: {},
      });
    }
    return exception;
  }

  async setupDatabase(credentialsDto: IRmqInput<SetupDBModel>) {
    let result: any, exception: any;
    if (this.connectionOk) {
      try {
        const userToken: string = credentialsDto.value.token;
        const valideToken = await this.mainComponent.tokenValidation(userToken);

        if (!isDefined(valideToken)) {
          return await responseRequest({
            status: 'unAutorized',
            data: null,
            params: `Invalide Token ${userToken} `,
          });
        }
        if (!valideToken.initialized) {
          return await responseRequest({
            status: 'errorUpdated',
            data: null,
            params: `Ce token ${userToken} devra être validé avant tout accès!`,
          });
        } else {
          result = await this.tenancyDatatableSetup.setup(
            this.connection,
            [tablesParamPublic, tablesParamCashew],
            tableIndex,
          );

          return responseRequest({
            status: 'ok',
            data: result,
            params: 'le processus de creation des tables à été enclenché!',
          });
        }
      } catch (error) {
        if (error.code === '22P02') {
          exception = await responseRequest({
            status: 'errorFound',
            data: result,
            params: error.message,
          });
        } else {
          exception = await responseRequest({
            status: 'errorOtherRequest',
            data: error.TypeError,
            params: error.message,
          });
        }
      }
    } else {
      exception = await responseRequest({
        status: 'errorOtherRequest',
        data: null,
        params: {},
      });
    }
    return exception;
  }
}
