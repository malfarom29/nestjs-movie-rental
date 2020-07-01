import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { Movie } from 'src/movies/entities/movie.entity';
import { UpdateMovieDto } from 'src/movies/dto/update-movie.dto';
import { MoviesService } from './movies.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/constants';

@Controller('admin/movies')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(UserRoles.ADMIN)
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

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
