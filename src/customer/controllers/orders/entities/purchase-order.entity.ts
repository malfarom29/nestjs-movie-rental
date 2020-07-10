import { User } from '../../../../users/entities/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  AfterInsert,
  BeforeInsert,
} from 'typeorm';
import { Movie } from '../../../../movies/entities/movie.entity';

@Entity()
export class PurchaseOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieId: number;

  @Column()
  userId: number;

  @Column()
  quantity: number;

  @Column({ type: 'float' })
  total: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(
    type => Movie,
    movie => movie.purchaseOrders,
  )
  movie: Movie;

  @ManyToOne(
    type => User,
    user => user.purchaseOrders,
  )
  user: User;

  @BeforeInsert()
  setCreatedAt(): void {
    this.createdAt = new Date();
  }

  @AfterInsert()
  async extractFromStock(): Promise<void> {
    const movie = await Movie.findOne({ id: this.movieId });
    movie.stock -= this.quantity;
    await movie.save();
  }
}
