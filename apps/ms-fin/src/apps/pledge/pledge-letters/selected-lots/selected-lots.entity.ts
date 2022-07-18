import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UUIDVersion } from 'class-validator';
import { PledgeProcessingEntity } from '../pledge-letters.entity';

@Entity('demande_natissement_lots_select', { schema: 'cashew' })
export class PledgeSelectedLotsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  processus_id: UUIDVersion;

  @Column({ type: 'uuid' })
  lot_id: UUIDVersion;

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
    () => PledgeProcessingEntity,
    (processNantissement: PledgeProcessingEntity) => processNantissement.listeLots,
    { nullable: false, primary: true, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'processus_id', referencedColumnName: 'id' })
  processNantissement: PledgeProcessingEntity;

}
