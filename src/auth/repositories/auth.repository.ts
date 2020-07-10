import { EntityRepository, Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import {
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';

@EntityRepository(Auth)
export class AuthRepository extends Repository<Auth> {
  async signIn(accessToken: string, userId: number): Promise<Auth> {
    const auth = new Auth();

    auth.accessToken = accessToken;
    auth.userId = userId;
    auth.refreshToken = nanoid();

    try {
      await auth.save();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }

    return auth;
  }

  async findRefreshAndValidate(refreshToken: string): Promise<Auth> {
    const today = new Date();
    const todayMs = today.getTime();

    const token = await this.findOne({ refreshToken }, { relations: ['user'] });
    const expiredToken = () => {
      const expirationMs = token.refreshExpiresAt.getTime();
      return token && expirationMs < todayMs;
    };

    if (!token || expiredToken()) {
      throw new ForbiddenException(`Invalid/Expired Token`);
    }

    return token;
  }
}
