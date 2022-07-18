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
import { RoleEntity } from '../role/role.entity';
import { UUIDVersion } from 'class-validator';
import { EntrepotAssignmentEntity } from '../entrepot-assignment/entrepot-assignment.entity';
import { SiteAssignmentEntity } from '../site-assignment/site-assignment.entity';

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

  @Column({ type: 'varchar', length: 150, unique: true, select: true })
  username: string;

  @Column({ type: 'varchar', select: true })
  password: string;

  @Column({ type: 'varchar', select: true })
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

  @ManyToOne(() => RoleEntity, (rule: RoleEntity) => rule.account, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  rule: RoleEntity;

  @OneToMany(
    () => EntrepotAssignmentEntity,
    (assignmentEntrepot: EntrepotAssignmentEntity) => assignmentEntrepot.superviseur,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  assignmentEntrepot: EntrepotAssignmentEntity[];

  @OneToMany(
    () => SiteAssignmentEntity,
    (assignmentSite: SiteAssignmentEntity) => assignmentSite.superviseur,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  assignmentSite: SiteAssignmentEntity[];
}
