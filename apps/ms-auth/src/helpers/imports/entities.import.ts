import { AccountEntity } from '../../apps/auth/account/account.entity';
import { BruteForceEntity } from '../../apps/auth/brute-force/brute-force.entity';
import { RefreshTokenEntity } from '../../apps/auth/refresh-token/refresh-token.entity';
import { RoleEntity } from '../../apps/roles/role.entity';

export const Entities = [
  RoleEntity,
  AccountEntity,
  RefreshTokenEntity,
  BruteForceEntity,
];
