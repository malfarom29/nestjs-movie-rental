import { MovieResponseDto } from '../../dtos/response/movie-response.dto';
import { Movie } from 'src/database/entities';
import { Injectable } from '@nestjs/common';
import * as aws from '../../config/aws/utils';
import { plainToClass } from 'class-transformer';
import { Mapper } from '../interfaces/mapper.interface';

@Injectable()
export class MovieImageMapper implements Mapper<MovieResponseDto, Movie> {
  async toDto(movies: Movie[], groups?: string[]): Promise<MovieResponseDto[]> {
    await Promise.all(
      movies.map(async movie => {
        if (movie.image)
          movie['imageUrl'] = await aws.downloadSignedUrl(movie.image.key);
      }),
    );

    const dto: MovieResponseDto[] = plainToClass(MovieResponseDto, movies, {
      groups,
    });
    return dto;
  }
}
