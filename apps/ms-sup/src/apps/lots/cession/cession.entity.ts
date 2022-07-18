import { UUIDVersion } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  BaseEntity,
  OneToOne,
  Index,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ExporterEntity } from '../../externe/exporter.entity';
import { LotEntity } from '../lot.entity';

@Entity('cession', { schema: 'cashew' })
@Index('index_lot_dest_rest', ['lot_id', 'recevant_id', 'cedant_id'], {
  unique: true,
})
export class CessionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  lot_id: UUIDVersion;

  @Column({ type: 'uuid' })
  recevant_id: UUIDVersion;

  @Column({ type: 'uuid' })
  cedant_id: UUIDVersion;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_session: Date;

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

  @OneToOne(() => LotEntity, (lot: LotEntity) => lot.cession, {
    nullable: false,

    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
  lot: LotEntity;

  @ManyToOne(
    () => ExporterEntity,
    (cedant: ExporterEntity) => cedant.cessionLotCedant,
    {
      nullable: true,
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
  cedant: ExporterEntity;

  @ManyToOne(
    () => ExporterEntity,
    (recevant: ExporterEntity) => recevant.cessionLotRecevant,
    {
      nullable: true,
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
  recevant: ExporterEntity;
}
