import { MovieFilterDto } from './../../../shared/dtos/request/filters/movie-filter.dto';
import { FilterDto } from './../../../shared/dtos/request/filter.dto';
import { PaginationDto } from './../../../shared/dtos/request/pagination.dto';
import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import { MovieResponseDto } from 'src/shared/dtos/response/movie-response.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { AuthGuard } from '@nestjs/passport';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';
import { MoviesService } from 'src/services/movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  getMovies(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterDto<MovieFilterDto>,
  ): Promise<PaginatedDataDto<MovieResponseDto[]>> {
    return this.moviesService.getMovies(paginationDto, filterDto);
  }

  @ApiTags('movies')
  @ApiResponse({
    description: 'Get movie by id. Anyone can access to this endpoint',
    status: 200,
    type: MovieResponseDto,
  })
  @Get('/:id')
  getMovieById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovieResponseDto> {
    return this.moviesService.getMovieById(id);
  }

  @ApiTags('movies')
  @Post('/:id/like')
  @UseGuards(AuthGuard(), WhitelistTokenGuard)
  likeAMovie(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: AuthorizedUser,
  ): Promise<void> {
    return this.moviesService.likeAMovie(id, user);
  }
}
