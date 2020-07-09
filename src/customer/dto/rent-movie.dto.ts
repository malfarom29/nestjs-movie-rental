import { Validate, IsNumber, IsInt, IsPositive } from 'class-validator';
import { ValidDate } from '../../shared/validators/valid-date.validator';
import { ReturningDateValidator } from 'src/shared/validators/returning-date.validator';

export class RentMovieDto {
  @IsPositive()
  @IsInt()
  @IsNumber()
  movieId: number;

  @Validate(ReturningDateValidator)
  @Validate(ValidDate)
  toBeReturnedAt: Date;
}
