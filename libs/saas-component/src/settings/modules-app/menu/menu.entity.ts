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
import { ModuleEntity } from '@app/saas-component/settings/modules-app/modules-app.entity';
import { SousMenuEntity } from '@app/saas-component/settings/modules-app/menu/smenu/sous-menu.entity';

@Entity('menus', { database: 'ricva_master' })
@Index('menu_app', ['module_id', 'frontend'], { unique: true })
export class MenuEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  module_id: UUIDVersion;

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

  @ManyToOne(() => ModuleEntity, (modules: ModuleEntity) => modules.menus, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id', referencedColumnName: 'id' })
  modules: ModuleEntity;

  @OneToMany(() => SousMenuEntity, (smenus: SousMenuEntity) => smenus.menus, {
    nullable: false,
    onUpdate: 'CASCADE',
    eager: true,
  })
  smenus: SousMenuEntity[];

  @OneToMany(
    () => AllowModulesEntity,
    (allowModule: AllowModulesEntity) => allowModule.menus,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  allowModule: AllowModulesEntity[];
}
