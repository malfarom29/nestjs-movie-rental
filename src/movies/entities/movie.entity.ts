import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeUpdate,
  getConnection,
  BeforeInsert,
} from 'typeorm';
import { MovieLog } from './movie-log.entity';
import { LineRentalOrder } from 'src/order/entities/line-rental-order.entity';

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

  @Column({ type: 'float' })
  dailyPenalty: number;

  @OneToMany(
    type => MovieLog,
    movieLog => movieLog.movie,
  )
  movieLogs: MovieLog[];

  @OneToMany(
    type => LineRentalOrder,
    lineRentalOrder => lineRentalOrder.movie,
  )
  lineRentalOrders: LineRentalOrder[];

  @BeforeInsert()
  setDailyPenalty(): void {
    this.dailyPenalty = 0.25 * this.rentalPrice;
  }

  // @BeforeUpdate()
  // logChanges(): void {
  //   console.log('updating movie...');
  //   delete this.id;

  //   getConnection()
  //     .createQueryBuilder()
  //     .insert()
  //     .into(MovieLog)
  //     .values({ ...this, movieId: this.id })
  //     .execute();
  // }
}
