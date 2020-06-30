import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Movie } from './movie.entity';

@Entity()
export class MovieLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  salePrice: number;

  @Column()
  rentalPrice: number;

  @Column()
  movieId: number;

  @ManyToOne(
    type => Movie,
    movie => movie.movieLogs,
  )
  movie: Movie;
}
