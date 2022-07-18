import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsInt,
  IsString,
  IsNotEmpty,
  UUIDVersion,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StateBooking } from '@app/saas-component/helpers/enums';
export class CreateBookingDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numero_reel: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  numero_change: string;

  @ApiProperty()
  @IsOptional()
  // @IsEnum(StateBooking)
  @Matches(
    `^${Object.values(StateBooking)
      .filter((v) => typeof v == 'number')
      .join('|')}$`,
    'i',
  )
  state: StateBooking;

  @ApiProperty({ description: 'packing list File' })
  @IsOptional()
  file: any;
}
