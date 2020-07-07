// import { MovieResponseDto } from './../shared/dtos/response/movie-response.dto';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from '../repositories/movie.repository';
import { PaginationDto } from '../shared/dtos/request/pagination.dto';
import { PaginatedDataDto } from '../shared/dtos/response/paginated-data.dto';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import * as aws from '../config/aws/utils';
import { Movie } from 'src/database/entities';
import { MovieResponseDto } from 'src/shared/dtos/response/movie-response.dto';
import * as _ from 'lodash';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { MovieImageMapper } from 'src/shared/mappers/movie-image.mapper';
import { VoteRepository } from 'src/repositories/votes.repository';
import { FilterDto } from 'src/shared/dtos/request/filter.dto';
import { MovieFilterDto } from 'src/shared/dtos/request/filters/movie-filter.dto';
import { MovieSerializer } from 'src/shared/serializers/movie-serializer';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieRepository)
    private movieRepository: MovieRepository,
    @InjectRepository(VoteRepository)
    private voteRepository: VoteRepository,
    private movieImageMapper: MovieImageMapper,
    private movieSerializer: MovieSerializer,
    private paginationSerializer: PaginatedSerializer<MovieResponseDto>,
  ) {}

  async getMovies(
    paginationDto: PaginationDto,
    filterDto: FilterDto<MovieFilterDto>,
  ): Promise<PaginatedDataDto<MovieResponseDto[]>> {
    const { data, totalCount } = await this.movieRepository.getMovies(
      paginationDto,
      filterDto,
    );
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 10;

    const mappedMovies = await this.movieImageMapper.toDto(data);

    return this.paginationSerializer.serialize(
      mappedMovies,
      totalCount,
      page,
      limit,
    );
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

    return this.movieSerializer.serialize(movie, signedUrl, user.roles);
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
