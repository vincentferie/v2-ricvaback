import {
  NatureOperation,
  TypeMovement,
} from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { SubBankAccountEntity } from '../../../apps/bank-account/sub-account/sub-account.entity';

@Entity('mouvement_compte', { schema: 'cashew' })
export class MovementEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid', nullable: true })
  sous_compte_banque_id: UUIDVersion;

  @Column({ type: 'varchar', length: 255 })
  intitule: string;

  @Column({ type: 'bigint' })
  solde_en_date: number;

  @Column({ type: 'bigint' })
  valeur: number;

  @Column({
    type: 'enum',
    enum: NatureOperation,
    default: NatureOperation.nivellement,
  })
  nature: NatureOperation;

  @Column({
    type: 'enum',
    enum: TypeMovement,
    default: TypeMovement.credit,
  })
  type: TypeMovement;

  @CreateDateColumn({
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
    () => SubBankAccountEntity,
    (compteBancaire: SubBankAccountEntity) => compteBancaire.mouvement,
    { nullable: true },
  )
  @JoinColumn({ name: 'sous_compte_banque_id', referencedColumnName: 'id' })
  sousCompteBancaire: SubBankAccountEntity;
}
