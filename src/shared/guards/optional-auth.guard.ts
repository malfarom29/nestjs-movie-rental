import { AuthorizedUser } from '../interfaces/authorized-user.interface';
import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest<AuthorizedUser>(
    err: undefined,
    user: AuthorizedUser,
  ): AuthorizedUser {
    return user;
  }
}
