import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { ROLE_KEY } from '../constants/roles.const';

export const Roles = (...roles: Role[]) => SetMetadata(ROLE_KEY, roles);
