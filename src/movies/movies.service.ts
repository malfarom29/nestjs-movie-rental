import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import { Movie } from './entities/movie.entity';
import { MoviesPaginationDto } from './dto/movies-pagination.dto';
import { PaginatedMoviesDto } from './dto/paginated-movies.dto';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger();
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
}
