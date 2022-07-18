import { UUIDVersion } from 'class-validator';

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { TenantAppListEntity } from '@app/saas-component/settings/tenant-app-list/tenant-app-list.entity';
import { TenantEntity } from '../tenant/tenant.entity';

@Entity('databasing', { database: 'ricva_master' })
@Index('tenant_database', ['tenant_id', 'tenant_app_id'], { unique: true })
export class DatabasingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  tenant_id: UUIDVersion;

  @Column({ type: 'uuid' })
  tenant_app_id: UUIDVersion;

  @Column({ type: 'varchar', length: 50, default: 'postgres' })
  type: string;

  @Column({ type: 'varchar', length: 100, default: 'localhost' })
  host: string;

  @Column({ type: 'int', default: 5432 })
  port: number;

  @Column({ type: 'varchar', length: 80 })
  basename: string;

  @Column({ type: 'boolean', default: false })
  active: boolean;

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

  @ManyToOne(
    () => TenantAppListEntity,
    (appList: TenantAppListEntity) => appList.database,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'tenant_app_id', referencedColumnName: 'id' })
  appList: TenantAppListEntity;

  @OneToOne(() => TenantEntity, (tenant: TenantEntity) => tenant.database, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id', referencedColumnName: 'id' })
  tenant: TenantEntity;
}
