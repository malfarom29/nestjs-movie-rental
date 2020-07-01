import { Role } from '../user/entities/role.entity';

export interface JwtPayload {
  username: string;
  roles: Role[];
}
