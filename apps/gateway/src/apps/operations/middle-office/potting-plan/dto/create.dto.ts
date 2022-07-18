import { IsOptional, IsUUID, UUIDVersion, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DetailPlanDto } from './detail-lot.dto';
import { ContainerPlanDto } from './detail-container.dto';

export class CreatePlanDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty({ type: IsUUID, description: 'ID of entrepot' })
  @IsNotEmpty()
  @IsUUID()
  entrepot_id: UUIDVersion;

  @ApiProperty({ type: IsUUID, description: 'ID of transitaire' })
  @IsNotEmpty()
  @IsUUID()
  transitaire_id: UUIDVersion;

  @ApiProperty({
    type: [ContainerPlanDto],
    description: 'Table of contianer ID',
  })
  @IsNotEmpty()
  conteneurs: ContainerPlanDto[];

  @ApiProperty({
    type: [DetailPlanDto],
    description: 'Table of lot : [{lot_id:uuid, nbr_sacs:0}]',
  })
  @IsNotEmpty()
  @IsOptional()
  lots: DetailPlanDto[];
}
