import { MovieResponseDto } from '../dtos/response/movie-response.dto';
import { Movie } from '../../movies/entities/movie.entity';
import { Injectable } from '@nestjs/common';
import * as aws from '../../config/aws/utils';
import { plainToClass } from 'class-transformer';
import { Mapper } from '../interfaces/mapper.interface';

@Injectable()
export class MovieImageMapper implements Mapper<MovieResponseDto, Movie> {
  async toDto(movies: Movie[], groups?: string[]): Promise<MovieResponseDto[]> {
    await Promise.all(
      movies.map(async movie => {
        if (movie.image) {
          const fileName = `${movie.image.key}.${movie.image.fileType}`;

          movie['imageUrl'] = await aws.downloadSignedUrl(fileName);
        }
      }),
    );

    const dto: MovieResponseDto[] = plainToClass(MovieResponseDto, movies, {
      groups,
    });
    return dto;
  }
}
