import { UUIDVersion } from 'class-validator';

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { AllowModulesEntity } from '@app/saas-component/settings/allow-modules/allow-apps.entity';
import { BaseUrlEntity } from '@app/saas-component/settings/base-url/base-url.entity';
import { MenuEntity } from '@app/saas-component/settings/modules-app/menu/menu.entity';

@Entity('modules', { database: 'ricva_master' })
@Index('module_app', ['base_url_id', 'libelle'], { unique: true })
export class ModuleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  base_url_id: UUIDVersion;

  @Column({ type: 'varchar', length: 100 })
  libelle: string;

  @Column({ type: 'varchar', length: 100 })
  frontend: string;

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

  @ManyToOne(() => BaseUrlEntity, (baseUrl: BaseUrlEntity) => baseUrl.modules, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'base_url_id', referencedColumnName: 'id' })
  baseUrl: BaseUrlEntity;

  @OneToMany(() => MenuEntity, (menus: MenuEntity) => menus.modules, {
    nullable: false,
    onUpdate: 'CASCADE',
    eager: true,
  })
  menus: MenuEntity[];

  @OneToMany(
    () => AllowModulesEntity,
    (allowModule: AllowModulesEntity) => allowModule.modules,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  allowModule: AllowModulesEntity[];
}
