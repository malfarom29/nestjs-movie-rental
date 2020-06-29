import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import { Movie } from './movie.entity';
import { MoviesPaginationDto } from './dto/movies-pagination.dto';
import { PaginatedMoviesDto } from './dto/paginated-movies.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieRepository)
    private movieRepository: MovieRepository,
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

  async updateMove(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.getMovieById(id);

    return this.movieRepository.save({ ...movie, ...updateMovieDto });
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
}
