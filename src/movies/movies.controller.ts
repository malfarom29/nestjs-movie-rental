import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { MoviesService } from 'src/services/movies.service';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { FilterDto } from 'src/shared/dtos/request/filter.dto';
import { MovieFilterDto } from 'src/shared/dtos/request/filters/movie-filter.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import { MovieResponseDto } from 'src/shared/dtos/response/movie-response.dto';
import { OptionalAuthGuard } from 'src/shared/guards/custom-auth.guard';

@Controller('movies')
@UseGuards(OptionalAuthGuard, WhitelistTokenGuard)
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
}
