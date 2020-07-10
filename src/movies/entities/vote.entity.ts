import { User } from '../../users/entities/user.entity';
import { Movie } from './movie.entity';
import {
  Entity,
  Column,
  Index,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index(['movieId', 'userId'], { unique: true })
@Entity({})
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieId: number;

  @Column()
  userId: number;

  @ManyToOne(
    type => Movie,
    movie => movie.votes,
  )
  movie: Movie;

  @ManyToOne(
    type => User,
    user => user.votes,
  )
  user: User;
}
