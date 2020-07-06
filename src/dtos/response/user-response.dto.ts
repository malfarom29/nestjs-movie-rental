import { Expose, Exclude } from 'class-transformer';
import { Role } from 'src/database/entities';

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
