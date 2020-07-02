import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { MovieLog } from './movie-log.entity';
import { RentalOrder } from 'src/database/entities/rental-order.entity';
import { MovieAttachment } from './movie-attachment.entity';

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

  @Column({ default: 0 })
  onRent: number;

  @Column({ type: 'float' })
  salePrice: number;

  @Column({ type: 'float' })
  rentalPrice: number;

  @Column({ default: true })
  availability: boolean;

  @Column({ type: 'float' })
  dailyPenalty: number;

  @Column({ nullable: true })
  imageId: number;

  @OneToMany(
    type => MovieLog,
    movieLog => movieLog.movie,
  )
  movieLogs: MovieLog[];

  @OneToMany(
    type => RentalOrder,
    rentalOrder => rentalOrder.movie,
  )
  rentalOrders: RentalOrder[];

  @OneToOne(type => MovieAttachment)
  @JoinColumn()
  image: MovieAttachment;

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
