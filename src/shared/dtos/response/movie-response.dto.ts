import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class MovieResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  stock: number;

  @ApiProperty()
  @Expose()
  salePrice: number;

  @ApiProperty()
  @Expose()
  rentalPrice: number;

  @ApiProperty({
    required: false,
  })
  @Expose()
  imageUrl?: string;

  @Expose()
  totalVotes: number;
}
