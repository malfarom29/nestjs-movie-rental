import { EntityRepository, Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { MoviesPaginationDto } from './dto/movies-pagination.dto';

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  async getMovies(
    moviesPaginationDto: MoviesPaginationDto,
  ): Promise<[Movie[], number]> {
    const query = this.createQueryBuilder('movie');
    const page = moviesPaginationDto.page;
    const limit = moviesPaginationDto.limit ? moviesPaginationDto.limit : 10;

    if (page) {
      const skippedItems = (page - 1) * limit;
      query.offset(skippedItems);
    }

    query.limit(limit);

    const data = query.getManyAndCount();

    return data;
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
    movie.availability = true;

    try {
      await movie.save();
    } catch (error) {
      console.log(error.stack);
      throw new InternalServerErrorException();
    }

    return movie;
  }
}
