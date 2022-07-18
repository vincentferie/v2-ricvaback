import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TenantEntity } from '@app/saas-component/settings/tenant/tenant.entity';
import { LogoCustomerEntity } from '@app/saas-component/settings/customer/logo/file-logo.entity';

@Entity('client', { database: 'ricva_master' })
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'varchar', length: 150, unique: true })
  libelle: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  contribuable: string;

  @Column({ type: 'varchar', length: 30 })
  contact: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  postal: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lieu: string;

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
    () => LogoCustomerEntity,
    (logo: LogoCustomerEntity) => logo.customer,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      eager: true,
    },
  )
  logo: LogoCustomerEntity;

  @OneToOne(() => TenantEntity, (tenant: TenantEntity) => tenant.infoTenant, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  tenant: TenantEntity;
}
