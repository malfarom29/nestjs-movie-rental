import { MovieAttachment } from '../../../database/entities/movie-attachment.entity';
import { UserRoles } from '../../constants';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import * as aws from '../../../config/aws/utils';

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
  availability: boolean;

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

  @Expose()
  totalVotes: number;
}
