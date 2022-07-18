import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UUIDVersion } from 'class-validator';
import { UnloadingEntity } from './unloading.entity';
import { LotEntity } from './lot.entity';
import { ReportWarnEntity } from './report.entity';

@Entity('account', { schema: 'public' })
export class AccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  role_id: UUIDVersion;

  @Column({ type: 'varchar', length: 50 })
  nom: string;

  @Column({ type: 'varchar', length: 150 })
  prenoms: string;

  @Column({ type: 'varchar', length: 30 })
  contact: string;

  @Column({ type: 'varchar', length: 150, unique: true, select: false })
  username: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar', select: false })
  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

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

  @OneToMany(
    () => UnloadingEntity,
    (dechargements: UnloadingEntity) => dechargements.superviseur,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  dechargements: UnloadingEntity[];

  @OneToMany(() => LotEntity, (lots: LotEntity) => lots.superviseur, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  lots: LotEntity[];

  @OneToMany(
    () => ReportWarnEntity,
    (signaler: ReportWarnEntity) => signaler.superviseur,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  signaler: ReportWarnEntity[];
}
