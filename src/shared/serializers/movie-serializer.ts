import { MovieResponseDto } from '../dtos/response/movie-response.dto';
import { plainToClass } from 'class-transformer';
import { SerializerDto } from './serializer-dto';
import { Movie } from 'src/database/entities';

export class MovieSerializer implements SerializerDto<MovieResponseDto> {
  serialize(
    movie: Movie,
    signedUrl: string,
    groups?: string[],
  ): MovieResponseDto {
    return plainToClass(MovieResponseDto, { ...movie, signedUrl }, { groups });
  }
}
