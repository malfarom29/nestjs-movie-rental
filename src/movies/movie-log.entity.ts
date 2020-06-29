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

  @Column({ nullable: true })
  oldTitle: string;

  @Column({ nullable: true })
  newTitle: string;

  @Column({ nullable: true })
  oldDescription: string;

  @Column({ nullable: true })
  newDescription: string;

  @Column({ type: 'float', nullable: true })
  oldSalePrice: number;

  @Column({ type: 'float', nullable: true })
  newSalePrice: number;

  @Column({ type: 'float', nullable: true })
  oldRentalPrice: number;

  @Column({ type: 'float', nullable: true })
  newRentalPrice: number;

  @Column()
  movieId: number;

  @ManyToOne(
    type => Movie,
    movie => movie.movieLogs,
  )
  movie: Movie;
}
