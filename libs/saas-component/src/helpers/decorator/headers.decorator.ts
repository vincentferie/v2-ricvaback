import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isDefined, isNotEmpty } from 'class-validator';
import { appList } from '../constants/apps.const';
import { IRmqPayload } from '../interfaces/rabbitmq-payload.interface';

export const GetPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IRmqPayload<any, any> | boolean => {
    let request: any;
    if (ctx.getType() === 'http') {
      request = ctx.switchToHttp().getRequest();
    }
    if (ctx.getType() === 'rpc') {
      request = ctx.switchToRpc().getData();
    }
    let userMakingRequest: any;
    if (isDefined(request.user)) {
      userMakingRequest = {
        id: request.user?.id,
        role: isDefined(request.user?.role_id)
          ? request.user?.role_id
          : request.user?.role.id,
        name: `${request.user?.prenoms} ${request.user?.nom}`,
      };
    } else {
      userMakingRequest = false;
    }

    const acceptUrl = appList.find(
      (baseUrl) =>
        /*request.headers.host*/ 'capsikansa.cashew.ricva.app'.includes(
          baseUrl,
        ),
      // request.headers.host.includes(baseUrl),
    );
    if (
      isDefined(acceptUrl) &&
      request.clientIp &&
      isDefined(request.headers['access-code']) &&
      isNotEmpty(request.headers['access-code']) &&
      isDefined(request.headers['access-tenant']) &&
      isNotEmpty(request.headers['access-tenant'])
    ) {
      // will can filter it (request.clientIp) for more secure

      const headers = {
        userAgent: request.headers['user-agent'],
        tenantHead: request.headers['access-code'],
        tenantId: request.headers['access-tenant'],
        clientIp: request.clientIp,
        route: request.route,
        other: {
          host: request.headers.host,
          url: request.url,
          method: request.method,
        },
      };
      const payload = {
        body: request.body,
        file: request?.file,
        param: request.params.uuid,
        query: request.query,
        user: userMakingRequest,
      };
      return { payload, headers } as IRmqPayload<any, any>;
    } else {
      return false;
    }
  },
);
