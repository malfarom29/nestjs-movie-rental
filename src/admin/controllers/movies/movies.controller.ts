import { AuthorizedUser } from './../../../shared/interfaces/authorized-user.interface';
import {
  Controller,
  UseGuards,
  Get,
  Query,
  Post,
  ValidationPipe,
  Body,
  Param,
  Put,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { MoviesService } from 'src/services/movies.service';
import { AuthGuard } from '@nestjs/passport';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/constants';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { FilterDto } from 'src/shared/dtos/request/filter.dto';
import { MovieFilterDto } from 'src/shared/dtos/request/filters/movie-filter.dto';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import { MovieResponseDto } from 'src/shared/dtos/response/movie-response.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { CreateMovieDto } from 'src/common/controllers/movies/dto/create-movie.dto';
import { Movie } from 'src/database/entities';
import { UpdateMovieDto } from 'src/common/controllers/movies/dto/update-movie.dto';
import { UploadMovieImageDto } from 'src/common/controllers/movies/dto/upload-movie-image.dto';

@Controller('admin/movies')
@UseGuards(AuthGuard(), WhitelistTokenGuard, RolesGuard)
@Roles(UserRoles.ADMIN)
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  getMovies(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterDto<MovieFilterDto>,
    @GetUser() user: AuthorizedUser,
  ): Promise<PaginatedDataDto<MovieResponseDto[]>> {
    return this.moviesService.getMovies(paginationDto, filterDto, user);
  }

  @Post()
  createMovie(
    @Body(ValidationPipe) createMovieDto: CreateMovieDto,
  ): Promise<Movie> {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Put('/:id')
  updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateMovieDto: UpdateMovieDto,
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
  uploadImage(
    @Body(ValidationPipe) uploadMovieImageDto: UploadMovieImageDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ signedUrl: string }> {
    return this.moviesService.saveImageKey(id, uploadMovieImageDto);
  }
}
