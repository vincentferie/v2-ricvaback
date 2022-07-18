import { UUIDVersion } from 'class-validator';

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { TenantEntity } from '@app/saas-component/settings/tenant/tenant.entity';

@Entity('type_tenant', { database: 'ricva_master' })
export class TypeTenantEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'varchar', length: 150, unique: true })
  libelle: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_date: Date;

  @Column({ type: 'varchar', length: 150, default: 'System' })
  created_by: string;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_date: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  updated_by: string;

  @DeleteDateColumn({ type: 'timestamp without time zone' })
  deleted_date: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  deleted_by: string;

  @OneToMany(() => TenantEntity, (tenant: TenantEntity) => tenant.typeTenant, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  tenant: TenantEntity[];
}
