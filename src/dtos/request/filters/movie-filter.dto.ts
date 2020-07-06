import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class MovieFilterDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @Transform(availability => {
    if (availability.toLowerCase() == 'true') {
      availability = true;
    } else if (availability.toLowerCase() == 'false') {
      availability = false;
    }
  })
  @IsBoolean()
  availability: boolean;
}
