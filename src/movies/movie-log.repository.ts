import { EntityRepository, Repository } from 'typeorm';
import { MovieLog } from './movie-log.entity';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './movie.entity';

@EntityRepository(MovieLog)
export class MovieLogRepository extends Repository<MovieLog> {
  createMovieLog(
    oldMovieData: Movie,
    updateMovieDto: UpdateMovieDto,
  ): Promise<MovieLog> {
    const log = new MovieLog();
    log.movie = oldMovieData;
    log.oldTitle = oldMovieData.title;
    log.newTitle = updateMovieDto.title;
    log.oldDescription = oldMovieData.description;
    log.newDescription = updateMovieDto.description;
    log.oldSalePrice = oldMovieData.salePrice;
    log.newSalePrice = updateMovieDto.salePrice;
    log.oldRentalPrice = oldMovieData.rentalPrice;
    log.newRentalPrice = updateMovieDto.rentalPrice;

    return log.save();
  }
}
