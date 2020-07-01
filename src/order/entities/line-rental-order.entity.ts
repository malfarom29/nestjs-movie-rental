import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { RentalOrder } from './rental-order.entity';
import { ReturnOrder } from './return-order.entity';

@Entity()
export class LineRentalOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  movieId: number;

  @Column()
  quantity: number;

  @ManyToOne(
    type => Movie,
    movie => movie.lineRentalOrders,
  )
  movie: Movie;

  @ManyToOne(
    type => RentalOrder,
    rentalOrder => rentalOrder.lineRentalOrders,
  )
  rentalOrder: RentalOrder;

  @OneToMany(
    type => ReturnOrder,
    returnOrder => returnOrder.lineRentalOrder,
  )
  returnOrders: ReturnOrder[];
}
