import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  AfterInsert,
} from 'typeorm';
import { RentalOrder } from './rental-order.entity';
import { Movie } from 'src/database/entities/movie.entity';

@Entity()
export class ReturnOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rentalOrderId: number;

  @Column({ type: 'float', default: 0 })
  penalty: number;

  @Column({ type: 'timestamp', default: new Date() })
  createdAt: Date;

  @OneToOne(type => RentalOrder)
  @JoinColumn()
  rentalOrder: RentalOrder;

  @AfterInsert()
  async sumsToMovieStock(): Promise<void> {
    const rentalOrder = await RentalOrder.findOne({ id: this.rentalOrderId });
    const movie = await Movie.findOne({ id: rentalOrder.movieId });
    movie.stock += 1;
    movie.onRent -= 1;
    await movie.save();
  }
}
