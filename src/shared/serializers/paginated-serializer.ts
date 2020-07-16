import { SerializerDto } from './serializer-dto';
import { PaginatedDataDto } from '../../shared/dtos/response/paginated-data.dto';
import { plainToClassFromExist } from 'class-transformer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginatedSerializer<V>
  implements SerializerDto<PaginatedDataDto<V>> {
  serialize<V>(
    data: V,
    totalCount: number,
    page: number,
    limit: number,
    groups?: string[],
  ): PaginatedDataDto<V> {
    return plainToClassFromExist(
      new PaginatedDataDto<V>(),
      { data, totalCount, page, limit },
      { groups },
    );
  }
}
