import { IsPositive, IsInt, IsNumber } from 'class-validator';

export class PurchaseMovieDto {
  @IsPositive()
  @IsInt()
  @IsNumber()
  movieId: number;

  @IsPositive()
  @IsInt()
  @IsNumber()
  quantity: number;
}
