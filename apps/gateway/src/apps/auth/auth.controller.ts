import { authPattern, msATH } from '@app/saas-component/helpers/constants';
import { GetPayload } from '@app/saas-component/helpers/decorator';
import {
  AuthCredentialsDto,
  AccountCredentialsDto,
  SetupDB,
} from '@app/saas-component/helpers/dto';
import { Sending } from '@app/saas-component/helpers/functions';
import { IRmqPayload } from '@app/saas-component/helpers/interfaces';
import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(msATH) private readonly clientService: ClientProxy) {}

  @Post('signin')
  @ApiBody({ type: AuthCredentialsDto })
  @UsePipes(ValidationPipe)
  async save(
    @Body() _body: AuthCredentialsDto,
    @GetPayload() payload: IRmqPayload<AuthCredentialsDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, authPattern[0]);
  }

  @ApiBearerAuth()
  @Post('refreshtoken')
  @UseGuards(AuthGuard('jwtRefreshtoken'))
  async refreshToken(
    @GetPayload() payload: IRmqPayload<any, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, authPattern[1]);
  }

  @Post('initialization')
  @ApiBody({ type: AccountCredentialsDto })
  @UsePipes(ValidationPipe)
  async initialization(
    @GetPayload() payload: IRmqPayload<AccountCredentialsDto, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, authPattern[2]);
  }

  @Post('setup')
  @ApiBody({ type: SetupDB })
  @UsePipes(ValidationPipe)
  async setup(
    @GetPayload() payload: IRmqPayload<SetupDB, any> | boolean,
  ): Promise<any> {
    return Sending(payload, this.clientService, authPattern[4]);
  }
}
