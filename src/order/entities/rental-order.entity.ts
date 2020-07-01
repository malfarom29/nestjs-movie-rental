import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { LineRentalOrder } from './line-rental-order.entity';

@Entity()
export class RentalOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(
    type => LineRentalOrder,
    lineRentalOrder => lineRentalOrder.rentalOrder,
  )
  lineRentalOrders: LineRentalOrder[];
}
