import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { AllowModulesEntity } from '@app/saas-component/settings/allow-modules/allow-apps.entity';
import { BaseUrlEntity } from '@app/saas-component/settings/base-url/base-url.entity';
import { DatabasingEntity } from '@app/saas-component/settings/database-access/database-access.entity';
import { TenantEntity } from '@app/saas-component/settings/tenant/tenant.entity';
@Entity('tenant_app_list', { database: 'ricva_master' })
@Index('baseurl_tenant', ['tenant_id', 'url_id'], { unique: true })
export class TenantAppListEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  tenant_id: UUIDVersion;

  @Column({ type: 'uuid' })
  url_id: UUIDVersion;

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

  @ManyToOne(() => TenantEntity, (tenant: TenantEntity) => tenant.appList, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id', referencedColumnName: 'id' })
  tenant: TenantEntity;

  @ManyToOne(() => BaseUrlEntity, (url: BaseUrlEntity) => url.appList, {
    nullable: true,
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'url_id', referencedColumnName: 'id' })
  url: BaseUrlEntity;

  @OneToOne(
    () => DatabasingEntity,
    (database: DatabasingEntity) => database.appList,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      eager: true,
    },
  )
  database: DatabasingEntity;

  @OneToMany(
    () => AllowModulesEntity,
    (allowModule: AllowModulesEntity) => allowModule.appList,
    { nullable: false, onUpdate: 'CASCADE', eager: true },
  )
  allowModule: AllowModulesEntity[];
}
