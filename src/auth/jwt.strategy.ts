import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repositories/user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
require('dotenv').config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthorizedUser> {
    const { username } = payload;
    const user = await this.userRepository.findOne(
      { username },
      { relations: ['roles'] },
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const roleNames: string[] = user.roles.map(role => role.label);

    return { userId: user.id, username, roles: roleNames };
  }
}
