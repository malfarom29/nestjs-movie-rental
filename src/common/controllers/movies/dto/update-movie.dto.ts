import { IsOptional } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  stock: number;

  @IsOptional()
  salePrice: number;

  @IsOptional()
  rentalPrice: number;
}
