import { IsOptional, IsUUID, UUIDVersion, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContainerPlanDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @ApiProperty({ type: IsUUID, description: 'ID of plan' })
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  plan_empotage_id: UUIDVersion;

  @ApiProperty({ type: IsUUID, description: 'ID of Container' })
  @IsNotEmpty()
  @IsUUID()
  conteneur_id: UUIDVersion;
}
