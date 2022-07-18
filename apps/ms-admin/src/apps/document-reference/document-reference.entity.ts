import { TypeDocumentNantissement } from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('document_info', { schema: 'cashew' })
export class DocumentRefEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'varchar', length: 150, nullable: true })
  refCode: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  destinateur: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  destinataire: string;

  @Column({ type: 'varchar', length: 150 })
  responsable: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  filename: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  path: string;

  @Column({ type: 'int', nullable: true })
  aws_id: number;

  @Column({ type: 'enum', enum: TypeDocumentNantissement })
  type: TypeDocumentNantissement;

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
}
