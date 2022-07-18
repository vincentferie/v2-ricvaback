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

export class CreateAccountDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty({ type: IsUUID, description: 'ID of Role' })
  @IsOptional()
  @IsUUID()
  role_id: UUIDVersion;

  @ApiProperty({
    type: IsString,
    description: "Last Name of Admin User. It's type is a string",
    example: 'DOE',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  nom: string;

  @ApiProperty({
    type: IsString,
    description: "First Name of Admin User. It's type is a string",
    example: 'Jhon',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(150)
  prenoms: string;

  @ApiProperty({
    type: IsString,
    description: "Phone number of Admin User. It's type is a string",
    example: '+225 00 00 00 00 00',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  contact: string;

  @ApiProperty({
    type: IsString,
    description: "login of Admin User. It's type is a string",
  })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  username: string;

  @ApiProperty({
    type: IsString,
    description: "Password of Admin User. It's type is a string",
    example: 'HzhjZj*ù^s@#ksj',
  })
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
