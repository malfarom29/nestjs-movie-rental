import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from './repositories/movie.repository';
import { MoviesPaginationDto } from './dto/movies-pagination.dto';
import { PaginatedMoviesDto } from './dto/paginated-movies.dto';
import { MovieAttachmentRepository } from './repositories/movie-attachment.repository';
import { plainToClass } from 'class-transformer';
import { MovieResponseDto } from './dto/response/movie-response.dto';
import * as aws from '../aws/utils';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(MovieRepository)
    private movieRepository: MovieRepository,
    @InjectRepository(MovieAttachmentRepository)
    private movieAttachmentRepository: MovieAttachmentRepository,
  ) {}

  async getMovies(
    moviesPaginationDto: MoviesPaginationDto,
  ): Promise<PaginatedMoviesDto> {
    const data = await this.movieRepository.getMovies(moviesPaginationDto);
    const paginatedMoviesDto: PaginatedMoviesDto = {
      data: data[0],
      totalCount: data[1],
      page: moviesPaginationDto.page ? Number(moviesPaginationDto.page) : 1,
      limit: moviesPaginationDto.limit ? Number(moviesPaginationDto.limit) : 10,
    };

    return paginatedMoviesDto;
  }

  async getMovieById(id: number): Promise<MovieResponseDto> {
    const movie = await this.movieRepository.findOne({ id });
    const attachment = await this.movieAttachmentRepository.findOne({
      id: movie.imageId,
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID "${id}" not found`);
    }

    const signedUrl = await aws.downloadSignedUrl(attachment.key);

    return plainToClass(MovieResponseDto, {
      ...movie,
      imageUrl: signedUrl,
    });
  }
}
