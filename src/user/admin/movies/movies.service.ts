import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { Movie } from 'src/database/entities';
import { UpdateMovieDto } from 'src/movies/dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from 'src/repositories/movie.repository';
import * as aws from '../../../config/aws/utils';
import { UploadMovieImageDto } from 'src/movies/dto/upload-movie-image.dto';
import { MovieAttachmentRepository } from 'src/repositories/movie-attachment.repository';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { FilterDto } from 'src/shared/dtos/request/filter.dto';
import { MovieFilterDto } from 'src/shared/dtos/request/filters/movie-filter.dto';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import { MovieSerializer } from 'src/shared/serializers/movie-serializer';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';
import { MovieAdminResponseDto } from 'src/shared/dtos/response/movie-admin-response.dto';
import { AdminMovieImageMapper } from 'src/shared/mappers/admin-movie-image.mapper';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieRepository)
    private movieRepository: MovieRepository,
    @InjectRepository(MovieAttachmentRepository)
    private movieAttachmentRepository: MovieAttachmentRepository,
    private movieImageMapper: AdminMovieImageMapper,
    private movieSerializer: MovieSerializer,
    private paginationSerializer: PaginatedSerializer<MovieAdminResponseDto>,
    private logger: Logger,
  ) {}

  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ id });

    if (!movie) {
      throw new NotFoundException(`Movie with ID "${id}" not found`);
    }

    return movie;
  }

  async getMovies(
    paginationDto: PaginationDto,
    filterDto: FilterDto<MovieFilterDto>,
  ): Promise<PaginatedDataDto<MovieAdminResponseDto[]>> {
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

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieRepository.createMovie(createMovieDto);
  }

  async updateMovie(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    await this.movieRepository.updateMovie(id, updateMovieDto);
    const movie = await this.getMovieById(id);
    return movie;
  }

  async updateMovieAvailability(id: number): Promise<Movie> {
    const movie = await this.getMovieById(id);
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
}
