import { ReturnOrder } from '../../customer/controllers/orders/entities/return-order.entity';
import { RentalOrderDto } from 'src/shared/dtos/response/rental-order.dto';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { Movie } from '../../movies/entities/movie.entity';
import { ReturnOrderResponseDto } from 'src/shared/dtos/response/return-order-response.dto';
import { MovieResponseDto } from 'src/shared/dtos/response/movie-response.dto';
import { OrderResponseDto } from 'src/shared/dtos/response/order-response.dto';
import { SerializerDto } from './serializer-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderSerializer
  implements SerializerDto<ReturnOrderResponseDto, RentalOrderDto> {
  serialize<V>(orderToSerialize: V, movie: Movie): OrderResponseDto<V> {
    return plainToClassFromExist(new OrderResponseDto<V>(), {
      order: orderToSerialize,
      movie: plainToClass(MovieResponseDto, movie),
    });
  }

  serializeWithRentalOrder(
    returnOrder: ReturnOrder,
  ): OrderResponseDto<ReturnOrderResponseDto> {
    const rentalOrder = returnOrder.rentalOrder;
    const orderSerialized = plainToClass(ReturnOrderResponseDto, {
      ...returnOrder,
      rentalOrder: plainToClass(RentalOrderDto, rentalOrder),
    });

    return this.serialize<ReturnOrderResponseDto>(
      orderSerialized,
      rentalOrder.movie,
    );
  }
}
