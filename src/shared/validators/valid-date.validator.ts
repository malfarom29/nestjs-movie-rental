import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
} from 'class-validator';
import validator from 'validator';

@ValidatorConstraint({ name: 'validDate', async: false })
export class ValidDate implements ValidatorConstraintInterface {
  validate(returningDate: string): boolean {
    const isDate = this.validDate(returningDate);

    return !!isDate;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.value} is not a valid date`;
  }

  private validDate(value: string) {
    return validator.toDate(value);
  }
}
