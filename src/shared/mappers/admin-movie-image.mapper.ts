import { Movie } from 'src/database/entities';
import { Injectable } from '@nestjs/common';
import * as aws from '../../config/aws/utils';
import { plainToClass } from 'class-transformer';
import { Mapper } from '../interfaces/mapper.interface';
import { MovieAdminResponseDto } from '../dtos/response/movie-admin-response.dto';

@Injectable()
export class AdminMovieImageMapper
  implements Mapper<MovieAdminResponseDto, Movie> {
  async toDto(
    movies: Movie[],
    groups?: string[],
  ): Promise<MovieAdminResponseDto[]> {
    await Promise.all(
      movies.map(async movie => {
        if (movie.image)
          movie['imageUrl'] = await aws.downloadSignedUrl(movie.image.key);
      }),
    );

    const dto: MovieAdminResponseDto[] = plainToClass(
      MovieAdminResponseDto,
      movies,
      {
        groups,
      },
    );
    return dto;
  }
}
