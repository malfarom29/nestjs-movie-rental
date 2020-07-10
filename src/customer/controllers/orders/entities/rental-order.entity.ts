import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  AfterInsert,
} from 'typeorm';
import { Movie } from '../../../../movies/entities/movie.entity';
import { Transform } from 'class-transformer';

@Entity()
export class RentalOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  movieId: number;

  @Column({ type: 'float' })
  total: number;

  @Column({ type: 'timestamp' })
  rentedAt: Date;

  @Column({ type: 'timestamp' })
  toBeReturnedAt: Date;

  @ManyToOne(
    type => Movie,
    movie => movie.rentalOrders,
    { eager: true },
  )
  @Transform(movie => movie.name)
  movie: Movie;

  @AfterInsert()
  async extractFromMovie(): Promise<void> {
    const movie = await Movie.findOne({ id: this.movieId });
    movie.stock -= 1;
    movie.onRent += 1;
    await movie.save();
  }
}
