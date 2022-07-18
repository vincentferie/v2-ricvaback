import { UUIDVersion } from 'class-validator';

export interface JwtPayload {
  data: any;
  iat: number;
  nbf: number;
  exp: number;
  aud: string;
  iss: string;
  jti: string;
}
