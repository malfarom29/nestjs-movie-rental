import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { Movie } from 'src/database/entities';
import { UpdateMovieDto } from 'src/movies/dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from 'src/repositories/movie.repository';
import * as aws from '../../../config/aws/utils';
import { UploadMovieImageDto } from 'src/movies/dto/upload-movie-image.dto';
import { MovieAttachmentRepository } from 'src/repositories/movie-attachment.repository';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(MovieRepository)
    private movieRepository: MovieRepository,
    @InjectRepository(MovieAttachmentRepository)
    private movieAttachmentRepository: MovieAttachmentRepository,
  ) {}

  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ id });

    if (!movie) {
      throw new NotFoundException(`Movie with ID "${id}" not found`);
    }

    return movie;
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieRepository.createMovie(createMovieDto);
  }

  async updateMovie(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    await this.movieRepository.update(id, updateMovieDto);

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
