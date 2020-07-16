import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class MovieFilterDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
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
