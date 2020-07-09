import { MovieSerializer } from './../shared/serializers/movie-serializer';
import { MovieImageMapper } from './../shared/mappers/movie-image.mapper';
import { MovieRepository } from './../repositories/movie.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';
import { MovieResponseDto } from 'src/shared/dtos/response/movie-response.dto';
import { Movie } from 'src/database/entities';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { FilterDto } from 'src/shared/dtos/request/filter.dto';
import { MovieFilterDto } from 'src/shared/dtos/request/filters/movie-filter.dto';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import * as aws from '../config/aws/utils';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { VoteRepository } from 'src/repositories/votes.repository';
import { CreateMovieDto } from 'src/common/controllers/movies/dto/create-movie.dto';
import { UpdateMovieDto } from 'src/common/controllers/movies/dto/update-movie.dto';
import { UploadMovieImageDto } from 'src/common/controllers/movies/dto/upload-movie-image.dto';
import { MovieAttachmentRepository } from 'src/repositories/movie-attachment.repository';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieRepository)
    private movieRepository: MovieRepository,
    @InjectRepository(MovieAttachmentRepository)
    private movieAttachmentRepository: MovieAttachmentRepository,
    @InjectRepository(VoteRepository)
    private voteRepository: VoteRepository,
    private movieImageMapper: MovieImageMapper,
    private movieSerializer: MovieSerializer,
    private paginatedSerializer: PaginatedSerializer<MovieResponseDto>,
  ) {}

  async getMovies(
    paginationDto: PaginationDto,
    filterDto: FilterDto<MovieFilterDto>,
    user?: AuthorizedUser,
  ): Promise<PaginatedDataDto<MovieResponseDto[]>> {
    const { data, totalCount } = await this.movieRepository.getMovies(
      paginationDto,
      filterDto,
    );

    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 10;

    const mappedMovies = await this.movieImageMapper.toDto(data, user?.roles);

    return this.paginatedSerializer.serialize(
      mappedMovies,
      totalCount,
      page,
      limit,
      user?.roles,
    );
  }

  async getMovieById(id: number): Promise<MovieResponseDto> {
    const movie = await this.findMovie(id);
    const fileName = `${movie.image.key}.${movie.image.fileType}`;

    const signedUrl = movie.image
      ? await aws.downloadSignedUrl(fileName)
      : null;

    return this.movieSerializer.serialize(movie, signedUrl);
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

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieRepository.createMovie(createMovieDto);
  }

  async updateMovie(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    await this.movieRepository.updateMovie(id, updateMovieDto);
    const movie = await this.findMovie(id);

    return movie;
  }

  async updateMovieAvailability(id: number): Promise<Movie> {
    const movie = await this.findMovie(id);
    movie.availability = !movie.availability;
    movie.save();

    return movie;
  }

  async deleteMovie(id: number): Promise<void> {
    const result = await this.movieRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async saveImageKey(
    id: number,
    uploadMovieImageDto: UploadMovieImageDto,
  ): Promise<{ signedUrl: string }> {
    const { fileType, mimeType } = uploadMovieImageDto;
    const awsUploadData = await aws.uploadSignedUrl(fileType, mimeType);
    const attachment = await this.movieAttachmentRepository.saveSignedUrl(
      awsUploadData,
    );

    await this.movieRepository.update(id, { image: attachment });

    return { signedUrl: awsUploadData.signedUrl };
  }

  async findMovie(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne(
      { id },
      { relations: ['image'] },
    );

    if (!movie) {
      throw new NotFoundException(`Movie with ID "${id}" not found`);
    }

    return movie;
  }
}
