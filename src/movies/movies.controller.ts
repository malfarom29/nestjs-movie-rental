import { UserRoles } from './../shared/constants';
import { RolesGuard } from './../shared/guards/roles.guard';
import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { PaginationDto } from '../shared/dtos/request/pagination.dto';
import { PaginatedDataDto } from '../shared/dtos/response/paginated-data.dto';
import { MovieResponseDto } from 'src/shared/dtos/response/movie-response.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FilterDto } from 'src/shared/dtos/request/filter.dto';
import { MovieFilterDto } from 'src/shared/dtos/request/filters/movie-filter.dto';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';

@Controller('movies')
@UseGuards(RolesGuard)
@Roles()
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
    @GetUser() user?: AuthorizedUser,
  ): Promise<MovieResponseDto> {
    return this.moviesService.getMovieById(id, user);
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
