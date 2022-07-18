import { UUIDVersion } from 'class-validator';

export interface RefreshTokenModel {
  id: UUIDVersion;
  user_id: UUIDVersion;
  is_revoked: boolean;
  expires: Date;
  token: string;
}
