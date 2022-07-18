import { JwtRefreshToken, JwtStrategy } from '@app/saas-component/helpers/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';

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
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtRefreshToken],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
