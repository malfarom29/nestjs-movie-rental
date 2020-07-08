import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'returningDate', async: false })
export class ReturningDateValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const today = new Date();
    const todayMs = today.getTime();

    const returningDate = new Date(value);
    const returningDateMs = returningDate.getTime();

    return todayMs < returningDateMs;
  }

  defaultMessage(): string {
    return `Returning date can only be one or more days from now`;
  }
}
