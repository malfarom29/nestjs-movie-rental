import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column({ type: 'timestamp' })
  refreshExpiresAt: Date;

  @BeforeInsert()
  refreshTokenExpiration(): void {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 2);
    this.refreshExpiresAt = expiresAt;
  }

  @ManyToOne(
    type => User,
    user => user.auths,
  )
  user: User;
}
