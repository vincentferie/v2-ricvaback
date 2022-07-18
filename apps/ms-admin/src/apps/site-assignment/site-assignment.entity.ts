import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountEntity } from '../account/account.entity';
import { SiteEntity } from '../sites/site.entity';

@Entity('assignment_site', { schema: 'cashew' })
@Index('index_assigment_site', ['superviseur_id', 'site_id'], {
  unique: true,
})
export class SiteAssignmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  superviseur_id: UUIDVersion;

  @Column({ type: 'uuid' })
  site_id: UUIDVersion;

  @Column({ type: 'boolean' })
  actif: boolean;

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
    () => AccountEntity,
    (superviseur: AccountEntity) => superviseur.assignmentSite,
    {
      nullable: false,
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'superviseur_id', referencedColumnName: 'id' })
  superviseur: AccountEntity;

  @ManyToOne(() => SiteEntity, (site: SiteEntity) => site.assignment, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'site_id', referencedColumnName: 'id' })
  site: SiteEntity;
}
