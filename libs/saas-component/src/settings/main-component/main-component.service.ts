import { clean, clean1 } from '@app/saas-component/helpers/constants';
import { cleanUp } from '@app/saas-component/helpers/functions';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDefined, UUIDVersion } from 'class-validator';
import { Repository } from 'typeorm';
import { BaseUrlEntity } from '@app/saas-component/settings/base-url/base-url.entity';
import { CampagneEntity } from '@app/saas-component/settings/campagne/campagne.entity';
import { VilleEntity } from '@app/saas-component/settings/ville/ville.entity';
import { BanquesEntity } from '../banques/banques.entity';
import { BanquesSpecEntity } from '../banques/banques-spec/banques-spec.entity';
import { TierDetenteursEntity } from '../tiers-detenteur/tiers-detenteur.entity';
import { IncotemsEntity } from '../incotems/incotems.entity';
import { TenantTokenValidationEntity } from '../tenant/token-validation/tenant-token.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { TenantEntity } from '../tenant/tenant.entity';

@Injectable()
export class MainComponentService {
  constructor(
    @InjectRepository(CampagneEntity)
    private readonly campagneRepo: Repository<CampagneEntity>,
    @InjectRepository(BaseUrlEntity)
    private readonly commoRepo: Repository<BaseUrlEntity>,
    @InjectRepository(VilleEntity)
    private readonly villeRepo: Repository<VilleEntity>,
    @InjectRepository(BanquesEntity)
    private readonly bankRepo: Repository<BanquesEntity>,
    @InjectRepository(BanquesSpecEntity)
    private readonly bankSpecRepo: Repository<BanquesSpecEntity>,
    @InjectRepository(TierDetenteursEntity)
    private readonly tiersRepo: Repository<TierDetenteursEntity>,
    @InjectRepository(IncotemsEntity)
    private readonly incotemRepo: Repository<IncotemsEntity>,
    @InjectRepository(TenantTokenValidationEntity)
    private readonly tokenRepo: Repository<TenantTokenValidationEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepo: Repository<TenantEntity>,
  ) {}

  async campagne(id: UUIDVersion): Promise<any> {
    let result: any;

    try {
      result = await this.campagneRepo.findOne(id, {
        select: ['id', 'libelle', 'ouverture', 'fermeture'],
        relations: ['detailsCampagne', 'speculation'],
        withDeleted: false,
      });
      const detail = [];
      if (isDefined(result)) {
        if (isDefined(result.detailsCampagne)) {
          for (const item of result.detailsCampagne) {
            detail.push(cleanUp(item, clean));
          }
          delete result.detailsCampagne;
        }
      }
      const specul = cleanUp(result.speculation, clean);
      delete specul.url;
      return { ...result, detailsCampagne: detail, speculation: specul };
    } catch (error) {
      return undefined;
    }
  }
  async selectCampagne(id: UUIDVersion): Promise<any[]> {
    const result = [];
    try {
      const found = await this.campagneRepo.find({
        select: ['id', 'libelle', 'prix_bord', 'ouverture', 'fermeture'],
        relations: ['detailsCampagne', 'speculation'],
        order: { ouverture: 'DESC' },
        where: { speculation_id: id },
        withDeleted: false,
      });
      if (isDefined(found)) {
        for (const elm of found) {
          const detail = [];
          if (isDefined(elm.detailsCampagne)) {
            for (const item of elm.detailsCampagne) {
              detail.push(cleanUp(item, clean));
            }
            delete elm.detailsCampagne;
          }
          const specul = cleanUp(elm.speculation, clean);
          delete specul.url;
          result.push({ ...elm, speculation: specul, detailsCampagne: detail });
        }
      }
      return result;
    } catch (error) {
      return undefined;
    }
  }

  async commodity(id: UUIDVersion): Promise<BaseUrlEntity> {
    let result: any;

    try {
      result = await this.commoRepo.findOne(id, {
        select: ['id', 'libelle'],
        withDeleted: false,
      });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }

  async ville(id: UUIDVersion): Promise<VilleEntity> {
    let result: any;

    try {
      result = await this.villeRepo.findOne(id, {
        select: ['id', 'libelle'],
        withDeleted: false,
      });
      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }
  async selectVille(): Promise<[VilleEntity]> {
    let result: any;

    try {
      result = await this.villeRepo.find({
        select: ['id', 'libelle'],
        order: { libelle: 'ASC' },
        withDeleted: false,
      });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }

  async banque(id: UUIDVersion): Promise<BanquesEntity> {
    let result: any;

    try {
      result = await this.bankRepo.findOne(id, {
        select: ['id', 'libelle'],
        withDeleted: false,
      });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }
  async selectBanque(): Promise<[BanquesEntity]> {
    let result: any;

    try {
      result = await this.bankRepo.find({
        select: ['id', 'libelle'],
        order: { libelle: 'ASC' },
        withDeleted: false,
      });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }

  async banqueWithSpec(id: UUIDVersion): Promise<BanquesEntity> {
    let result: any;

    try {
      result = await this.bankRepo.findOne(id, {
        select: ['id', 'libelle'],
        relations: ['details'],
        withDeleted: false,
      });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }

  async banqueSepc(id: UUIDVersion): Promise<BanquesSpecEntity> {
    let result: any;

    try {
      result = await this.bankSpecRepo.findOne(id, { withDeleted: false });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }

  async tierDetenteur(id: UUIDVersion): Promise<TierDetenteursEntity> {
    let result: any;

    try {
      result = await this.tiersRepo.findOne(id, {
        select: ['id', 'raison'],
        withDeleted: false,
      });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }
  async selectTierDetenteur(): Promise<[TierDetenteursEntity]> {
    let result: any;

    try {
      result = await this.tiersRepo.find({
        select: ['id', 'raison'],
        withDeleted: false,
      });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }

  async incotems(id: UUIDVersion): Promise<IncotemsEntity> {
    let result: any;

    try {
      result = await this.incotemRepo.findOne(id, {
        select: ['id', 'libelle', 'description'],
        withDeleted: false,
      });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }
  async selectIncotems(): Promise<[IncotemsEntity]> {
    let result: any;

    try {
      result = await this.incotemRepo.find({
        select: ['id', 'libelle', 'description'],
        withDeleted: false,
      });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }

  async tokenValidation(token: string): Promise<TenantTokenValidationEntity> {
    let result: any;

    try {
      result = await this.tokenRepo.findOne({
        select: ['tenant_id', 'initialized'],
        where: { token: token },
        withDeleted: false,
      });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }

  async customer(id: UUIDVersion): Promise<CustomerEntity> {
    let result: any;

    try {
      result = await this.customerRepo.findOne(id, {
        select: [
          'id',
          'libelle',
          'description',
          'contribuable',
          'contact',
          'email',
          'postal',
          'lieu',
        ],
        relations: ['logo'],
        withDeleted: false,
      });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }

  async appAccess(id: UUIDVersion): Promise<TenantEntity> {
    let result: any;

    try {
      result = await this.tenantRepo.findOne({
        where: {
          client_id: id,
        },
        withDeleted: false,
      });

      if (isDefined(result)) {
        return result;
      }
    } catch (error) {
      return undefined;
    }
  }
}
