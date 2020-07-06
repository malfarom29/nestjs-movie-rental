import { IsOptional, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Transform(page => parseInt(page))
  @IsPositive()
  page: number;

  @IsOptional()
  @Transform(limit => parseInt(limit))
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsString()
  sort: string;
}
