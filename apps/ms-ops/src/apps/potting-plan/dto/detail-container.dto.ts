import { IsOptional, IsUUID, UUIDVersion, IsNotEmpty } from 'class-validator';

export class ContainerPlanDto {
  @IsOptional()
  @IsUUID()
  id: UUIDVersion;

  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  plan_empotage_id: UUIDVersion;

  @IsNotEmpty()
  @IsUUID()
  conteneur_id: UUIDVersion;
}
