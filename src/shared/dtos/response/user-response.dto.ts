import { Expose, Exclude } from 'class-transformer';
import { Role } from '../../../users/entities/role.entity';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  roles: Role[];
}
