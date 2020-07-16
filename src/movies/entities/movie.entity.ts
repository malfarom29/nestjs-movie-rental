import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MovieLog } from './movie-log.entity';
import { RentalOrder } from '../../customer/controllers/orders/entities/rental-order.entity';
import { MovieAttachment } from './movie-attachment.entity';
import { PurchaseOrder } from '../../customer/controllers/orders/entities/purchase-order.entity';
import { Vote } from './vote.entity';

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

  totalVotes: number;

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

  @OneToMany(
    type => PurchaseOrder,
    purchaseOrder => purchaseOrder.movie,
  )
  purchaseOrders: PurchaseOrder[];

  @OneToOne(type => MovieAttachment)
  @JoinColumn()
  image: MovieAttachment;

  @OneToMany(
    type => Vote,
    vote => vote.movie,
  )
  votes: Vote[];

  @BeforeInsert()
  setDailyPenalty(): void {
    this.dailyPenalty = 0.25 * this.rentalPrice;
  }

  // @BeforeUpdate()
  // async logChanges(): Promise<void> {
  //   console.log('updating movie...');
  //   delete this.id;

  //   await getConnection()
  //     .createQueryBuilder()
  //     .insert()
  //     .into(MovieLog)
  //     .values({ ...this, movieId: this.id })
  //     .execute();
  // }
}
