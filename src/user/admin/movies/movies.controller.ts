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
  Get,
  Query,
} from '@nestjs/common';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { Movie } from 'src/database/entities';
import { UpdateMovieDto } from 'src/movies/dto/update-movie.dto';
import { MoviesService } from './movies.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/constants';
import { UploadMovieImageDto } from 'src/movies/dto/upload-movie-image.dto';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { FilterDto } from 'src/shared/dtos/request/filter.dto';
import { MovieFilterDto } from 'src/shared/dtos/request/filters/movie-filter.dto';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import { MovieResponseDto } from 'src/shared/dtos/response/movie-response.dto';

@Controller('admin/movies')
@UseGuards(AuthGuard(), WhitelistTokenGuard, RolesGuard)
@Roles(UserRoles.ADMIN)
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  getMovies(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterDto<MovieFilterDto>,
  ): Promise<PaginatedDataDto<MovieResponseDto[]>> {
    return this.moviesService.getMovies(paginationDto, filterDto);
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
    return this.moviesService.updateMovie(id, updateMovieDto);
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

  @Patch('/:id/signed-url')
  @UsePipes(ValidationPipe)
  uploadImage(
    @Body() uploadMovieImageDto: UploadMovieImageDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ signedUrl: string }> {
    return this.moviesService.saveImageKey(id, uploadMovieImageDto);
  }
}
