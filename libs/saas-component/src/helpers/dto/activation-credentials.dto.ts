import { IsNotEmpty, IsString, Length } from 'class-validator';
export class AccountCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @Length(30, 50)
  token: string;

  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  prenoms: string;

  @IsNotEmpty()
  @IsString()
  contact: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
