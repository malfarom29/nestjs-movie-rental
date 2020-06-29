import { IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  stock: number;

  @IsNotEmpty()
  salePrice: number;

  @IsNotEmpty()
  rentalPrice: number;
}
