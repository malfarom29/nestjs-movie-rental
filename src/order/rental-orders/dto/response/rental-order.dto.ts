import { Movie } from 'src/database/entities/movie.entity';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class RentalOrderDto {
  @Expose()
  id: number;

  @Expose()
  movie: Movie;

  @Expose()
  rentedAt: Date;

  @Expose()
  toBeReturnedAt: Date;

  @Expose()
  total: number;
}
