import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]): CustomDecorator<string> => {
  console.log(roles);
  return SetMetadata('roles', roles);
};
