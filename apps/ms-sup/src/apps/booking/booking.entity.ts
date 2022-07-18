import { StateBooking } from '@app/saas-component/helpers/enums';
import { UUIDVersion } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContainerEntity } from '../container/container.entity';
import { FileBookingEntity } from './file/file-booking.entity';

@Entity('booking', { schema: 'cashew' })
export class BookingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'varchar', length: 25, unique: true })
  numero_reel: string;

  @Column({ type: 'varchar', length: 25, unique: true, nullable: true })
  numero_change: string;

  @Column({
    type: 'enum',
    enum: StateBooking,
    default: StateBooking.encours,
  })
  state: StateBooking;

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

  @OneToOne(
    () => FileBookingEntity,
    (file: FileBookingEntity) => file.booking,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  file: FileBookingEntity;

  @OneToMany(
    () => ContainerEntity,
    (conteneurs: ContainerEntity) => conteneurs.booking,
    {
      nullable: false,
      onUpdate: 'RESTRICT',
    },
  )
  conteneurs: ContainerEntity[];

}
