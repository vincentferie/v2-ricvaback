import { msJwtStrategy } from '@app/saas-component/helpers/jwt';
import { MainComponentModule } from '@app/saas-component/settings/main-component/main-component.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshToken } from '../../helpers/jwt/jwt.refreshtoken.strategy';
import { TenantDatabaseService } from '../../helpers/services/init-table.service';
import { AccountRepository } from './account/account.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenRepository } from './refresh-token/refresh-token.repository';

@Module({
  imports: [
    PassportModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        defaultStrategy: config.get<string>('passportStrategy'),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JwtSecretKey'),
        signOptions: {
          expiresIn: config.get<number>('JwtOptionExpiresIn'),
          algorithm: config.get('JwtOptionAlgorithm'),
        },
        verifyOptions: {
          clockTolerance: config.get<number>('JwtVerifOptionClockTolerence'),
          algorithms: [config.get('JwtOptionAlgorithm')],
          maxAge: config.get<string>('JwtVerifOptionMaxAge'),
        },
      }),
    }),
    MainComponentModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountRepository,
    RefreshTokenRepository,
    msJwtStrategy.JwtStrategy,
    JwtRefreshToken,
    TenantDatabaseService,
  ],
  exports: [msJwtStrategy.JwtStrategy, JwtRefreshToken, PassportModule],
})
export class AuthModule {}
