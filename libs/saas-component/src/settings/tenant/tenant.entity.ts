import { UUIDVersion } from 'class-validator';

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { CustomerEntity } from '@app/saas-component/settings/customer/customer.entity';
import { TenantAppListEntity } from '@app/saas-component/settings/tenant-app-list/tenant-app-list.entity';
import { TypeTenantEntity } from '@app/saas-component/settings/type/type-tenant.entity';
import { DatabasingEntity } from '../database-access/database-access.entity';

@Entity('tenant', { database: 'ricva_master' })
export class TenantEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  type_id: UUIDVersion;

  @Column({ type: 'uuid' })
  client_id: UUIDVersion;

  @Column({ type: 'varchar', length: 100, unique: true })
  headers_code: string;

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

  @OneToOne(
    () => CustomerEntity,
    (infoTenant: CustomerEntity) => infoTenant.tenant,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  infoTenant: CustomerEntity;

  @ManyToOne(
    () => TypeTenantEntity,
    (typeTenant: TypeTenantEntity) => typeTenant.tenant,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'type_id', referencedColumnName: 'id' })
  typeTenant: TypeTenantEntity;

  @OneToMany(
    () => TenantAppListEntity,
    (appList: TenantAppListEntity) => appList.tenant,
    { nullable: false, onUpdate: 'CASCADE', eager: true },
  )
  appList: TenantAppListEntity[];

  @OneToOne(
    () => DatabasingEntity,
    (database: DatabasingEntity) => database.tenant,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      eager: true,
    },
  )
  database: DatabasingEntity;
}
