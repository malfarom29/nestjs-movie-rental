import { Movie } from '../../movies/entities/movie.entity';
import Faker from 'faker';
import { define } from 'typeorm-seeding';

define(Movie, (faker: typeof Faker) => {
  const movie = new Movie();
  movie.title = faker.random.words(4);
  movie.description = faker.lorem.paragraph(2);
  movie.stock = faker.random.number(25);
  movie.salePrice = faker.random.number(40.0);
  movie.rentalPrice = faker.random.number(4);

  return movie;
});
