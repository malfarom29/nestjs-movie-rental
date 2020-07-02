import { PipeTransform, BadRequestException } from '@nestjs/common';
import validator from 'validator';

export class DayFromNowValidationPipe implements PipeTransform {
  transform(value: string): Date {
    const returningDate = this.dateValidator(value);

    if (!returningDate) {
      throw new BadRequestException(`Not a valid date`);
    }

    const now = new Date();
    const nowInMiliseconds = now.getTime();
    const returningDateInMiliseconds = returningDate.getTime();

    if (returningDateInMiliseconds < nowInMiliseconds) {
      throw new BadRequestException(
        `Returning date can only be one or more days from now`,
      );
    }

    return returningDate;
  }

  private dateValidator(value: string) {
    return validator.toDate(value);
  }
}
