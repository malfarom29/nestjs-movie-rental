import { PipeTransform, BadGatewayException } from '@nestjs/common';
import validator from 'validator';

export class EmailValidatorPipe implements PipeTransform {
  transform(value: string): string {
    const isEmail = this.emailValidator(value);

    if (!isEmail) {
      throw new BadGatewayException(`${value} is not a valid email`);
    }

    return value;
  }

  private emailValidator(email: string) {
    return validator.isEmail(email);
  }
}
