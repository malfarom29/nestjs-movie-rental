import { OrderResponseDto } from 'src/shared/dtos/response/order-response.dto';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';

export interface SerializerDto<V, D = any> {
  serialize(...args: any): OrderResponseDto<V> | V | V[];
  serialize<V>(...args: any): OrderResponseDto<V> | PaginatedDataDto<V> | V;
}
