import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Auth } from 'src/database/entities/auth.entity';

@Injectable()
export class WhitelistTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { headers } = context.switchToHttp().getRequest();
    const token = headers.authorization.split(' ')[1];

    if (!token) {
      return false;
    }

    const found = await Auth.findOne({ accessToken: token });

    if (!found) {
      throw new ForbiddenException(`Invalid/Expired Token`);
    }

    return true;
  }
}
