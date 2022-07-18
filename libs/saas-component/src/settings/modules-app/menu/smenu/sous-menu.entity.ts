import { AllowModulesEntity } from '@app/saas-component/settings/allow-modules/allow-apps.entity';
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
import { MenuEntity } from '@app/saas-component/settings/modules-app/menu/menu.entity';
@Entity('sous_menus', { database: 'ricva_master' })
@Index('smenu_app', ['menu_id', 'libelle'], { unique: true })
export class SousMenuEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid', nullable: true })
  menu_id: UUIDVersion;

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

  @ManyToOne(() => MenuEntity, (menus: MenuEntity) => menus.smenus, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'menu_id', referencedColumnName: 'id' })
  menus: MenuEntity;

  @OneToMany(
    () => AllowModulesEntity,
    (allowModule: AllowModulesEntity) => allowModule.smenus,
    { nullable: true, onUpdate: 'CASCADE' },
  )
  allowModule: AllowModulesEntity[];
}
