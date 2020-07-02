import {
  Controller,
  UseGuards,
  Post,
  Body,
  Param,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/constants';
import { RentalOrdersService } from './rental-orders.service';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { DayFromNowValidationPipe } from './pipes/day-from-now-validation.pipe';
import { RentalOrderDto } from './dto/response/rental-order.dto';
import { ReturnOrderDto } from './dto/response/return-order.dto';

@Controller('rental-orders')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(UserRoles.CUSTOMER, UserRoles.ADMIN)
export class RentalOrdersController {
  constructor(private rentalOrdersService: RentalOrdersService) {}

  @Post('/movie/:movieId')
  rentMovie(
    @Body('toBeReturnedAt', DayFromNowValidationPipe) toBeReturnedAt: Date,
    @Param('movieId') movieId: number,
    @GetUser() user: AuthorizedUser,
  ): Promise<RentalOrderDto> {
    return this.rentalOrdersService.rentMovie(movieId, user, toBeReturnedAt);
  }

  @Get('/:id')
  getRentalOrderById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RentalOrderDto> {
    return this.rentalOrdersService.getRentalOrderById(id);
  }

  @Post('/:id/return')
  returnMovie(@Param('id', ParseIntPipe) id: number): Promise<ReturnOrderDto> {
    return this.rentalOrdersService.returnMovie(id);
  }
}
