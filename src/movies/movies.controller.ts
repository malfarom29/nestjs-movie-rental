import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { MoviesPaginationDto } from './dto/movies-pagination.dto';
import * as config from 'config';
import { PaginatedMoviesDto } from './dto/paginated-movies.dto';

@Controller('movies')
export class MoviesController {
  private readonly awsConfig = config.get('aws');
  constructor(private moviesService: MoviesService) {}

  @Get()
  getMovies(
    @Query() moviesPaginationDto: MoviesPaginationDto,
  ): Promise<PaginatedMoviesDto> {
    return this.moviesService.getMovies(moviesPaginationDto);
  }

  @Get('/:id')
  getMovieById(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    return this.moviesService.getMovieById(id);
  }
}
