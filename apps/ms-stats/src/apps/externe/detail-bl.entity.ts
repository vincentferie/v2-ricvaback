import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Double,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContainerEntity } from './container.entity';
import { BillOfLadingEntity } from './bl.entity';

@Entity('details_bill_lading', { schema: 'cashew' })
@Index('index_details_billoflading', ['bill_lading_id', 'conteneur_id'], {
  unique: true,
})
export class DetailBlEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  bill_lading_id: UUIDVersion;

  @Column({ type: 'uuid' })
  conteneur_id: UUIDVersion;

  @Column({ type: 'int' })
  nbr_sacs: number;

  @Column({ type: 'float' })
  gross_weight: Double;

  @Column({ type: 'float' })
  tare: Double;

  @Column({ type: 'float' })
  measurement: Double;

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
    () => ContainerEntity,
    (conteneur: ContainerEntity) => conteneur.detailBls,
    { nullable: false, onUpdate: 'CASCADE', eager: true },
  )
  @JoinColumn({ name: 'conteneur_id', referencedColumnName: 'id' })
  conteneur: ContainerEntity;

  @ManyToOne(
    () => BillOfLadingEntity,
    (bl: BillOfLadingEntity) => bl.detailBls,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'bill_lading_id', referencedColumnName: 'id' })
  bl: BillOfLadingEntity;
}
