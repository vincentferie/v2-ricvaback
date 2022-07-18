import { UUIDVersion } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { LotEntity } from '../lot.entity';

@Entity('transfert', { schema: 'cashew' })
@Index(
  'index_lot_prov_dest',
  ['lot_id', 'entrepot_provenance_id', 'entrepot_destination_id'],
  { unique: true },
)
export class TransfertEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  lot_id: UUIDVersion;

  @Column({ type: 'uuid' })
  entrepot_provenance_id: UUIDVersion;

  @Column({ type: 'uuid' })
  entrepot_destination_id: UUIDVersion;

  @Column({ type: 'int' })
  poids_net_mq: number;

  @Column({ type: 'int' })
  sac_mq: number;

  @Column({ type: 'int' })
  poids_net_dechet: number;

  @Column({ type: 'int' })
  sac_dechet: number;

  @Column({ type: 'int' })
  poids_net_poussiere: number;

  @Column({ type: 'int' })
  sac_poussiere: number;

  @Column({ type: 'int' })
  total_sac_trie: number;

  @Column({ type: 'varchar', length: 150 })
  statut_triage: string;

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

  @ManyToOne(() => LotEntity, (lots: LotEntity) => lots.transferts, {
    nullable: false,

    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
  lots: LotEntity;
}
