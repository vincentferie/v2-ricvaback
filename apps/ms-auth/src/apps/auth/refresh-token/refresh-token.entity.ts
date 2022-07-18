import { UUIDVersion } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refresh_token', { schema: 'public' })
export class RefreshTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column({ type: 'uuid' })
  user_id: UUIDVersion;

  @Column({ type: 'boolean' })
  is_revoked: boolean;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expires: Date;

  @Column({ type: 'varchar' })
  token: string;
}
