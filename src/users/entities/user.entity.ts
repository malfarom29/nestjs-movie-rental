import { PurchaseOrder } from '../../customer/controllers/orders/entities/purchase-order.entity';
import {
  Entity,
  Unique,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Role } from './role.entity';
import * as bcrypt from 'bcrypt';
import { Auth } from '../../auth/entities/auth.entity';
import { Vote } from '../../movies/entities/vote.entity';

@Entity()
@Unique(['username', 'email', 'resetPasswordToken'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @ManyToMany(type => Role)
  @JoinTable()
  roles: Role[];

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordTokenExpiresIn: Date;

  @OneToMany(
    type => PurchaseOrder,
    purchaseOrder => purchaseOrder.user,
  )
  purchaseOrders: PurchaseOrder[];

  @OneToMany(
    type => Auth,
    auth => auth.user,
  )
  auths: Auth[];

  @OneToMany(
    type => Vote,
    vote => vote.user,
  )
  votes: Vote[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
