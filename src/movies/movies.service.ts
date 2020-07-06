// import { MovieResponseDto } from './../shared/dtos/response/movie-response.dto';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from '../repositories/movie.repository';
import { PaginationDto } from '../dtos/request/pagination.dto';
import { PaginatedDataDto } from '../dtos/response/paginated-data.dto';
import { MovieAttachmentRepository } from '../repositories/movie-attachment.repository';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import * as aws from '../config/aws/utils';
import { Movie } from 'src/database/entities';
import { MovieResponseDto } from 'src/dtos/response/movie-response.dto';
import * as _ from 'lodash';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { MovieImageMapper } from 'src/shared/mappers/movie-image.mapper';
import { VoteRepository } from 'src/repositories/votes.repository';
import { FilterDto } from 'src/dtos/request/filter.dto';
import { MovieFilterDto } from 'src/dtos/request/filters/movie-filter.dto';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(MovieRepository)
    private movieRepository: MovieRepository,
    @InjectRepository(VoteRepository)
    private voteRepository: VoteRepository,
    private movieImageMapper: MovieImageMapper,
  ) {}

  async getMovies(
    paginationDto: PaginationDto,
    filterDto: FilterDto<MovieFilterDto>,
    user: AuthorizedUser,
  ): Promise<PaginatedDataDto<MovieResponseDto>> {
    const { data, totalCount } = await this.movieRepository.getMovies(
      paginationDto,
      filterDto,
      user,
    );

    const mappedMovied = await this.movieImageMapper.toDto(data, user.roles);

    const paginatedDataDto = plainToClassFromExist(
      new PaginatedDataDto<MovieResponseDto>(),
      {
        data: mappedMovied,
        totalCount: totalCount,
        page: Number(paginationDto.page) || 1,
        limit: Number(paginationDto.limit) || 10,
      },
      { groups: user.roles },
    );

    return paginatedDataDto;
  }

  async getMovieById(
    id: number,
    user?: AuthorizedUser,
  ): Promise<MovieResponseDto> {
    const movie = await this.movieRepository.findOne(
      { id },
      { relations: ['image'] },
    );

    if (!movie) {
      throw new NotFoundException(`Movie with ID "${id}" not found`);
    }

    let signedUrl: string;
    if (movie.image) {
      signedUrl = await aws.downloadSignedUrl(movie.image.key);
    }

    return plainToClass(
      MovieResponseDto,
      {
        ...movie,
        imageUrl: signedUrl || null,
      },
      {
        groups: user.roles,
      },
    );
  }

  async likeAMovie(movieId: number, user: AuthorizedUser): Promise<void> {
    await this.findMovie(movieId);

    const vote = await this.voteRepository.findOne({
      movieId,
      userId: user.userId,
    });

    if (!vote) {
      await this.voteRepository.save({ movieId, userId: user.userId });
    } else {
      await this.voteRepository.delete({ movieId, userId: user.userId });
    }

    return;
  }

  async findMovie(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ id });

    if (!movie) {
      throw new NotFoundException(`Movie with ID "${id}" not found`);
    }

    return movie;
  }
}
