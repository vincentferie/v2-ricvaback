import { REQUEST } from '@nestjs/core';
import { Provider, Scope } from '@nestjs/common';
import { Connection } from 'typeorm';
import { IRmqPayloadRecieved } from '@app/saas-component/helpers/interfaces';
import { TenantEntity } from '@app/saas-component/settings';
import { isDefined } from 'class-validator';
import { getTenantConnection } from '../../public/tenancy.utilis';
import { IRmqMessage } from '@app/saas-component/helpers/interfaces/rabbitmq-message.interface';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';
export const TenantProvider: Provider = {
  provide: TENANT_CONNECTION,
  inject: [REQUEST, Connection],
  scope: Scope.REQUEST,
  useFactory: async (
    request: IRmqMessage<IRmqPayloadRecieved<any>>,
    connection,
  ) => {
    const redisPayload = request.data.headers;
    let foundApp: any;
    // get Tenant informaiton
    const repoTenant = connection.getRepository(TenantEntity);
    const tenant = await repoTenant.findOne({
      select: ['id'],
      where: {
        headers_code: `${redisPayload.tenantHead}`,
        client_id: redisPayload.tenantId,
      },
      withDeleted: false,
    });
    if (isDefined(tenant)) {
      // Check if url is allowed
      foundApp = tenant.appList.find((baseUrl) =>
        'capsikansa.cashew.ricva.app'.includes(baseUrl.url.url),
      );
      // foundApp = tenant.appList.find((baseUrl) => redisPayload.other.host.includes(baseUrl.url.url));

      if (foundApp !== undefined && foundApp.database.active === true) {
        return getTenantConnection(redisPayload.tenantHead, foundApp.database)
          .then((elem) => elem)
          .catch((err) => console.debug(err));
        // it's has to be different
      } else {
        // Script for write loggin
        return null;
      }
    } else {
      // Script for write loggin
      return null;
    }
  },
};
