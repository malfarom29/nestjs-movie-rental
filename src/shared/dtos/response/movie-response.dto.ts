import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '../../../shared/constants';

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

  @ApiProperty({
    required: false,
  })
  @Expose({ groups: [UserRoles.ADMIN] })
  onRent: number;

  @ApiProperty()
  @Expose()
  salePrice: number;

  @ApiProperty()
  @Expose()
  rentalPrice: number;

  @ApiProperty({
    required: false,
  })
  @Expose({ groups: [UserRoles.ADMIN] })
  dailyPenalty: number;

  @ApiProperty({
    required: false,
  })
  @Expose()
  imageUrl?: string;

  @ApiProperty({
    required: false,
  })
  @Expose({ groups: [UserRoles.ADMIN] })
  availability: boolean;

  @Expose()
  totalVotes: number;
}
