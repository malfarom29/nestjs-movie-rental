import {
  Controller,
  UseGuards,
  Post,
  ValidationPipe,
  Body,
  Param,
  Put,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { MoviesService } from 'src/movies/services/movies.service';
import { AuthGuard } from '@nestjs/passport';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/constants';
import { CreateMovieDto } from 'src/admin/controllers/movies/dto/create-movie.dto';
import { Movie } from '../../../movies/entities/movie.entity';
import { UpdateMovieDto } from 'src/admin/controllers/movies/dto/update-movie.dto';
import { UploadMovieImageDto } from 'src/admin/controllers/movies/dto/upload-movie-image.dto';

@Controller('admin/movies')
@UseGuards(AuthGuard(), WhitelistTokenGuard, RolesGuard)
@Roles(UserRoles.ADMIN)
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

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
