import { Movie } from 'src/movies/entities/movie.entity';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class ReturnOrderDto {
  @Expose()
  id: number;

  @Expose()
  movie: Movie;

  @Expose()
  createdAt: Date;

  @Expose()
  penalty: number;
}
