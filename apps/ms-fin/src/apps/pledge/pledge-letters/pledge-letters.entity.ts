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
} from 'typeorm';
import { UUIDVersion } from 'class-validator';
import { BankAccountEntity } from '../../bank-account/bank-account.entity';
import { SubBankAccountEntity } from '../../bank-account/sub-account/sub-account.entity';
import { WarehousesEntity } from '../../externe/warehouses.entity';
import { AnalysisRequestEntity } from './analysis-request/analysis-request.entity';
import { ApplicationPledgeEntity } from './application-pledge/application-pledge.entity';
import { DrawRequestEntity } from './draw-request/draw-request.entity';
import { ReleaseRequestEntity } from './release-request/release-request.entity';
import { PledgeSelectedLotsEntity } from './selected-lots/selected-lots.entity';

@Entity('processus_nantissement', { schema: 'cashew' })
export class PledgeProcessingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  campagne_id: UUIDVersion;

  @Column({ type: 'uuid' })
  compte_banque_id: UUIDVersion;

  @Column({ type: 'uuid' })
  sous_compte_banque_id: UUIDVersion;

  @Column({ type: 'uuid' })
  entrepot_id: UUIDVersion;

  @Column({ type: 'varchar', length: 150 })
  numero: string;

  @Column({ type: 'int' })
  prix_unitaire: number;

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
    () => BankAccountEntity,
    (compte: BankAccountEntity) => compte.processNantissement,
    { nullable: false, primary: true, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'compte_banque_id', referencedColumnName: 'id' })
  compte: BankAccountEntity;

  @ManyToOne(
    () => SubBankAccountEntity,
    (sousCompte: SubBankAccountEntity) => sousCompte.processNantissement,
    { nullable: false, primary: true, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'sous_compte_banque_id', referencedColumnName: 'id' })
  sousCompte: SubBankAccountEntity;

  @ManyToOne(
    () => WarehousesEntity,
    (entrepot: WarehousesEntity) => entrepot.processNantissement,
    { nullable: false, primary: true, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'entrepot_id', referencedColumnName: 'id' })
  entrepot: WarehousesEntity;

  @OneToMany(
    () => AnalysisRequestEntity,
    (demandeAnalyse: AnalysisRequestEntity) =>
      demandeAnalyse.processNantissement,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  demandeAnalyse: AnalysisRequestEntity[];

  @OneToMany(
    () => ApplicationPledgeEntity,
    (demandeNantissement: ApplicationPledgeEntity) =>
      demandeNantissement.processNantissement,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  demandeNantissement: ApplicationPledgeEntity[];

  @OneToMany(
    () => DrawRequestEntity,
    (demandeRelache: DrawRequestEntity) => demandeRelache.processNantissement,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  demandeRelache: DrawRequestEntity[];

  @OneToMany(
    () => ReleaseRequestEntity,
    (demandeTirage: ReleaseRequestEntity) => demandeTirage.processNantissement,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  demandeTirage: ReleaseRequestEntity[];

  @OneToMany(
    () => PledgeSelectedLotsEntity,
    (listeLots: PledgeSelectedLotsEntity) => listeLots.processNantissement,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  listeLots: PledgeSelectedLotsEntity[];
}
