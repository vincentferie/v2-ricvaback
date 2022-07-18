import {
  IsOptional,
  IsUUID,
  IsString,
  UUIDVersion,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty({
    type: IsString,
    description: "Name of rule. It's type is a string",
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  libelle: string;
}
