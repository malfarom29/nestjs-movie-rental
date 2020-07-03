import { UserRoles } from '../shared/constants';
import { EntityRepository, Repository } from 'typeorm';
import { Movie } from '../database/entities';
import { CreateMovieDto } from '../movies/dto/create-movie.dto';
import { InternalServerErrorException, Query } from '@nestjs/common';
import { PaginationDto } from '../shared/dtos/request/pagination.dto';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  async getMovies(
    paginationDto: PaginationDto,
    user: AuthorizedUser,
  ): Promise<{ data: Movie[]; totalCount: number }> {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = (page - 1) * limit;

    const query = this.createQueryBuilder('movie');
    query.leftJoinAndSelect('movie.image', 'movie_attachment');

    if (!user.roles.includes(UserRoles.ADMIN)) {
      query.andWhere('movie.availability = :availability', {
        availability: true,
      });
    }

    query.take(limit).skip(skip);

    const [movies, total] = await query.getManyAndCount();

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
}
