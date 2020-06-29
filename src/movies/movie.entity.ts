import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column()
  availability: boolean;
}
