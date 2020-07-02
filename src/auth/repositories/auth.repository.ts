import { EntityRepository, Repository } from 'typeorm';
import { Auth } from '../../database/entities/auth.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { nanoid } from 'nanoid';

@EntityRepository(Auth)
export class AuthRepository extends Repository<Auth> {
  async signIn(accessToken: string): Promise<Auth> {
    const auth = new Auth();

    auth.accessToken = accessToken;
    auth.refreshToken = nanoid();

    try {
      await auth.save();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }

    return auth;
  }
}
