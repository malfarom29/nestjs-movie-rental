import { ReturnOrder } from './../../database/entities/return-order.entity';
import { RentalOrderDto } from 'src/dtos/response/rental-order.dto';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { Movie } from 'src/database/entities';
import { ReturnOrderResponseDto } from 'src/dtos/response/return-order-response.dto';
import { MovieResponseDto } from 'src/dtos/response/movie-response.dto';
import { OrderResponseDto } from 'src/dtos/response/order-response.dto';

export class OrderSerializer {
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
