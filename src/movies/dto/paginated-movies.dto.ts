import { Movie } from '../../database/entities/movie.entity';

export class PaginatedMoviesDto {
  data: Movie[];
  totalCount: number;
  page: number;
  limit: number;
}
