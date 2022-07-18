import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { CampagneEntity } from '@app/saas-component/settings/campagne/campagne.entity';
import { ModuleEntity } from '@app/saas-component/settings/modules-app/modules-app.entity';
import { TenantAppListEntity } from '@app/saas-component/settings/tenant-app-list/tenant-app-list.entity';

@Entity('base_url', { database: 'ricva_master' })
export class BaseUrlEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'varchar', length: 150 })
  libelle: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  url: string;

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

  @OneToMany(() => ModuleEntity, (modules: ModuleEntity) => modules.baseUrl, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  modules: ModuleEntity[];

  @OneToMany(
    () => TenantAppListEntity,
    (appList: TenantAppListEntity) => appList.url,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  appList: TenantAppListEntity[];

  @OneToMany(
    () => CampagneEntity,
    (campagne: CampagneEntity) => campagne.speculation,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  campagne: CampagneEntity[];
}
