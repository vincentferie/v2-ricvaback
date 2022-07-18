import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { MenuEntity } from '@app/saas-component/settings/modules-app/menu/menu.entity';
import { SousMenuEntity } from '@app/saas-component/settings/modules-app/menu/smenu/sous-menu.entity';
import { ModuleEntity } from '@app/saas-component/settings/modules-app/modules-app.entity';
import { TenantAppListEntity } from '@app/saas-component/settings/tenant-app-list/tenant-app-list.entity';

@Entity('allow_modules', { database: 'ricva_master' })
@Index('app_module', ['tenant_app_id', 'module_id', 'menu_id', 'smenu_id'], {
  unique: true,
})
export class AllowModulesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  tenant_app_id: UUIDVersion;

  @Column({ type: 'uuid' })
  module_id: UUIDVersion;

  @Column({ type: 'uuid' })
  menu_id: UUIDVersion;

  @Column({ type: 'uuid', nullable: true })
  smenu_id: UUIDVersion;

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
    (appList: TenantAppListEntity) => appList.allowModule,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'tenant_app_id', referencedColumnName: 'id' })
  appList: TenantAppListEntity;

  @ManyToOne(
    () => ModuleEntity,
    (modules: ModuleEntity) => modules.allowModule,
    { nullable: false, onUpdate: 'CASCADE', eager: true },
  )
  @JoinColumn({ name: 'module_id', referencedColumnName: 'id' })
  modules: ModuleEntity;

  @ManyToOne(() => MenuEntity, (menus: MenuEntity) => menus.allowModule, {
    nullable: false,
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'menu_id', referencedColumnName: 'id' })
  menus: MenuEntity;

  @ManyToOne(
    () => SousMenuEntity,
    (smenus: SousMenuEntity) => smenus.allowModule,
    { nullable: true, onUpdate: 'CASCADE', eager: true },
  )
  @JoinColumn({ name: 'smenu_id', referencedColumnName: 'id' })
  smenus: SousMenuEntity;
}
