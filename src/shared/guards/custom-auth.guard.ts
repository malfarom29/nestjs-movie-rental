import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest<AuthorizedUser>(
    err: undefined,
    user: AuthorizedUser,
  ): AuthorizedUser {
    return user;
  }
}
