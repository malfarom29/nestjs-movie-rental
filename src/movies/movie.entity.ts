import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeUpdate,
  getConnection,
} from 'typeorm';
import { MovieLog } from './movie-log.entity';

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  stock: number;

  @Column({ type: 'float' })
  salePrice: number;

  @Column({ type: 'float' })
  rentalPrice: number;

  @Column({ default: true })
  availability: boolean;

  @OneToMany(
    type => MovieLog,
    movieLog => movieLog.movie,
  )
  movieLogs: MovieLog[];

  @BeforeUpdate()
  logChanges(): void {
    console.log('updating movie...');
    delete this.id;

    getConnection()
      .createQueryBuilder()
      .insert()
      .into(MovieLog)
      .values({ ...this, movieId: this.id })
      .execute();
  }
}
