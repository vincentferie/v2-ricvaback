import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  UUIDVersion,
} from 'class-validator';

export class RefreshTokensDto {
  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  id: UUIDVersion;

  @IsNotEmpty()
  @IsUUID()
  user_id: UUIDVersion;

  @IsNotEmpty()
  @IsBoolean()
  is_revoked: boolean;

  @IsNotEmpty()
  @IsDate()
  expires: Date;

  @IsNotEmpty()
  @IsString()
  token: string;
}
