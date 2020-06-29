import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
  Put,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movie.entity';
import { MoviesPaginationDto } from './dto/movies-pagination.dto';
import * as config from 'config';
import { v1 as uuid } from 'uuid';
import { awsS3 } from '../config/aws-sdk.config';
import { UpdateMovieDto } from './dto/update-movie.dto';
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

  @Post()
  @UsePipes(ValidationPipe)
  createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.moviesService.updateMove(id, updateMovieDto);
  }

  @Patch('/:id/availability')
  updateMovieAvailability(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Movie> {
    return this.moviesService.updateMovieAvailability(id);
  }

  @Delete('/:id')
  deleteMovie(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.moviesService.deleteMovie(id);
  }
}
