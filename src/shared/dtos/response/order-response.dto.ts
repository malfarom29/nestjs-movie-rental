import { MovieResponseDto } from './movie-response.dto';

export class OrderResponseDto<T> {
  order: T;
  movie: MovieResponseDto;
}
