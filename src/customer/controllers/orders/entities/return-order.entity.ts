import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  AfterInsert,
  BeforeInsert,
} from 'typeorm';
import { RentalOrder } from './rental-order.entity';
import { Movie } from '../../../../movies/entities/movie.entity';

@Entity()
export class ReturnOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rentalOrderId: number;

  @Column({ type: 'float', default: 0 })
  penalty: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @OneToOne(type => RentalOrder)
  @JoinColumn()
  rentalOrder: RentalOrder;

  @BeforeInsert()
  setCreatedAt(): void {
    this.createdAt = new Date();
  }

  @AfterInsert()
  async sumsToMovieStock(): Promise<void> {
    const rentalOrder = await RentalOrder.findOne({ id: this.rentalOrderId });
    const movie = await Movie.findOne({ id: rentalOrder.movieId });
    movie.stock += 1;
    movie.onRent -= 1;
    await movie.save();
  }
}
