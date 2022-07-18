import { IsNotEmpty, IsString, Length } from 'class-validator';
export class SetupDB {
  @IsNotEmpty()
  @IsString()
  @Length(30, 50)
  token: string;
}
