import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const target = context.getClass() || context.getHandler();
    const roles = this.reflector.get<string[]>('roles', target);

    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const hasRole = user.roles.some(userRole =>
      roles.find(role => role === userRole),
    );

    return user && hasRole;
  }
}
