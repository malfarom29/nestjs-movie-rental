import { PipeTransform, BadRequestException } from '@nestjs/common';

export class RolesArrayValidatorPipe implements PipeTransform {
  transform(values: string[]): string[] {
    const isArray = Array.isArray(values);
    if (!isArray) {
      throw new BadRequestException(`Roles must be an array`);
    }

    return values;
  }
}
