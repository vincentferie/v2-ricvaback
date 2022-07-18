import { applyDecorators, Injectable, Scope } from '@nestjs/common';

export const TenantDecorateurService = () =>
  applyDecorators(Injectable({ scope: Scope.REQUEST }));
