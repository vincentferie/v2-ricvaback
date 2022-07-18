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
import { FileDrawRequestEntity } from './file-draw-request.entity';
import { ForwarderEntity } from '../../../externe/forwarder.entity';

@Entity('demande_tirage', { schema: 'cashew' })
export class DrawRequestEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  processus_id: UUIDVersion;

  @Column({ type: 'uuid' })
  transitaire_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150 })
  navire: string;

  @Column({ type: 'varchar', length: 150 })
  destination: string;

  @Column({ type: 'varchar', length: 150 })
  port_embarquement: string;

  @Column({ type: 'int' })
  poids: number;

  @Column({ type: 'bigint' })
  valeur_total: number;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

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
    (processNantissement: PledgeProcessingEntity) => processNantissement.demandeRelache,
    { nullable: false, primary: true, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'processus_id', referencedColumnName: 'id' })
  processNantissement: PledgeProcessingEntity;

  @ManyToOne(
    () => ForwarderEntity,
    (transitaire: ForwarderEntity) => transitaire.demandeRelache,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'transitaire_id', referencedColumnName: 'id' })
  transitaire: ForwarderEntity;

  @OneToOne(
    () => FileDrawRequestEntity,
    (file: FileDrawRequestEntity) => file.relache,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  file: FileDrawRequestEntity;
}
