import {
  IsOptional,
  IsUUID,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  UUIDVersion,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsOptional()
  @IsUUID()
  role_id: UUIDVersion;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  nom: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(150)
  prenoms: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  contact: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(150)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Faible mot de passe. Variez les caractères (A;a;#;1).',
  })
  password: string;

  @IsOptional()
  @IsString()
  salt: string;
}
