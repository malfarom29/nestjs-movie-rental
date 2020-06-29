import { IsOptional, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class MoviesPaginationDto {
  @IsOptional()
  @Transform(page => parseInt(page))
  @IsPositive()
  page: number;

  @IsOptional()
  @Transform(limit => parseInt(limit))
  @IsPositive()
  limit: number;
}
