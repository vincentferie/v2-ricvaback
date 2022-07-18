import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanquesSpecEntity } from '../banques/banques-spec/banques-spec.entity';
import { BanquesEntity } from '../banques/banques.entity';
import { BaseUrlEntity } from '../base-url/base-url.entity';
import { CampagneEntity } from '../campagne/campagne.entity';
import { CampagneSpecEntity } from '../campagne/details/campagne-spec.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { IncotemsEntity } from '../incotems/incotems.entity';
import { TenantEntity } from '../tenant/tenant.entity';
import { TenantTokenValidationEntity } from '../tenant/token-validation/tenant-token.entity';
import { TierDetenteursEntity } from '../tiers-detenteur/tiers-detenteur.entity';
import { VilleEntity } from '../ville/ville.entity';
import { MainComponentService } from './main-component.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CampagneEntity,
      CampagneSpecEntity,
      BaseUrlEntity,
      VilleEntity,
      BanquesEntity,
      BanquesSpecEntity,
      TierDetenteursEntity,
      IncotemsEntity,
      TenantTokenValidationEntity,
      CustomerEntity,
      TenantEntity,
    ]),
  ],
  providers: [MainComponentService],
  exports: [MainComponentService],
})
export class MainComponentModule {}
