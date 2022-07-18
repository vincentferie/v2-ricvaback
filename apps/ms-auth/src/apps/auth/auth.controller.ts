import { authPattern } from '@app/saas-component/helpers/constants';
import {
  AuthCredentialsDto,
  AccountCredentialsDto,
  SetupDB,
} from '@app/saas-component/helpers/dto';
import {
  IRmqInput,
  IRmqPayloadHeader,
} from '@app/saas-component/helpers/interfaces';
import {
  RmqPayloadBodyPipe,
  RmqPayloadHeaderPipe,
  RmqPayloadQueryPipe,
} from '@app/saas-component/helpers/pipes';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly service: AuthService) {}

  @MessagePattern({ cmd: authPattern[0] })
  async signin(
    @Payload(new RmqPayloadBodyPipe())
    message: IRmqInput<AuthCredentialsDto>,
    @Payload(new RmqPayloadHeaderPipe()) headerInfo: IRmqPayloadHeader,
  ): Promise<any> {
    return this.service.signin(message, headerInfo);
  }

  @MessagePattern({ cmd: authPattern[1] })
  async refreshToken(
    @Payload(new RmqPayloadBodyPipe())
    message: IRmqInput<any>,
  ): Promise<any> {
    return this.service.refreshToken(message);
  }

  @MessagePattern({ cmd: authPattern[2] })
  async initialization(
    @Payload(new RmqPayloadBodyPipe())
    message: IRmqInput<AccountCredentialsDto>,
  ): Promise<any> {
    return this.service.initialization(message);
  }

  @MessagePattern({ cmd: authPattern[4] })
  async setup(
    @Payload(new RmqPayloadBodyPipe())
    message: IRmqInput<SetupDB>,
  ): Promise<any> {
    return this.service.setupDatabase(message);
  }
}
