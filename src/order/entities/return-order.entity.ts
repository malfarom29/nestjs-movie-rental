import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { LineRentalOrder } from './line-rental-order.entity';

@Entity()
export class ReturnOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  quantity: number;

  @Column({ type: 'float', default: 0 })
  penalty: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(
    type => LineRentalOrder,
    lineRentalOrder => lineRentalOrder.returnOrders,
  )
  lineRentalOrder: LineRentalOrder;
}
