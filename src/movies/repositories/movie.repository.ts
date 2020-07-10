import { UserRoles } from '../../shared/constants';
import {
  EntityRepository,
  Repository,
  SelectQueryBuilder,
  getConnection,
} from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { MovieLog } from '../entities/movie-log.entity';
import { CreateMovieDto } from '../../admin/controllers/movies/dto/create-movie.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { PaginationDto } from '../../shared/dtos/request/pagination.dto';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { FilterDto } from 'src/shared/dtos/request/filter.dto';
import { MovieFilterDto } from 'src/shared/dtos/request/filters/movie-filter.dto';
import { UpdateMovieDto } from 'src/admin/controllers/movies/dto/update-movie.dto';

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  async getMovies(
    paginationDto: PaginationDto,
    filterDto: FilterDto<MovieFilterDto>,
    user?: AuthorizedUser,
  ): Promise<{ data: Movie[]; totalCount: number }> {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const sort = paginationDto.sort || 'title';
    const skip = (page - 1) * limit;
    const query = this.createQueryBuilder('movie');
    query
      .leftJoinAndSelect('movie.image', 'movie_attachment')
      .leftJoinAndSelect('movie.votes', 'vote');

    this.filterMovies(query, filterDto.filters, user);

    query.take(limit).skip(skip);
    query
      .addSelect('COUNT(vote.movieId)', 'total_votes')
      .groupBy('movie.id, movie_attachment.id, vote.id');

    this.sortMovies(query, sort);

    const [movies, total] = await query.getManyAndCount();

    this.getAndMapTotalOfVotes(movies);

    return { data: movies, totalCount: total };
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const {
      title,
      description,
      stock,
      salePrice,
      rentalPrice,
    } = createMovieDto;

    const movie = new Movie();

    movie.title = title;
    movie.description = description;
    movie.stock = stock;
    movie.salePrice = salePrice;
    movie.rentalPrice = rentalPrice;

    try {
      await movie.save();
    } catch (error) {
      console.log(error.stack);
      throw new InternalServerErrorException();
    }

    return movie;
  }

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto): Promise<void> {
    const currentMovie = await this.findOne({ id });
    if (currentMovie.stock !== updateMovieDto.stock) {
      const movieId = currentMovie.id;
      delete currentMovie.id;
      getConnection()
        .createQueryBuilder()
        .insert()
        .into(MovieLog)
        .values({ ...currentMovie, movieId })
        .execute();
    }
    await this.update(id, updateMovieDto);
  }

  private filterMovies(
    query: SelectQueryBuilder<Movie>,
    filters: MovieFilterDto,
    user?: AuthorizedUser,
  ): void {
    if (!filters) {
      return;
    }

    if (filters.title) {
      query.andWhere('movie.title ILIKE :title', {
        title: `%${filters.title}%`,
      });
    }

    if (user && user.roles.includes(UserRoles.ADMIN) && filters.availability) {
      query.andWhere('movie.availability = :availability', {
        availability: filters.availability,
      });
    } else {
      query.andWhere('movie.availability = :availability', {
        availability: true,
      });
    }
  }

  private getAndMapTotalOfVotes(data: Movie | Movie[]) {
    if (Array.isArray(data)) {
      data.map(movie => {
        movie.totalVotes = movie.votes.length;
      });
    } else {
      data.totalVotes = data.votes.length;
    }
  }

  private sortMovies(query: SelectQueryBuilder<Movie>, sort: string): void {
    let field = sort[0] === '-' ? sort.split('-')[1] : sort;
    field = field === 'totalVotes' ? 'total_votes' : `movie.${field}`;

    if (sort[0] == '-') {
      query.orderBy(field, 'DESC');
    } else {
      query.orderBy(field, 'ASC');
    }
  }
}
