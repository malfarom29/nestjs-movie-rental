import { UserRegistrationDto } from './../../user/dto/user-registration.dto';
import { Role } from '../entities/role.entity';
import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/repositories/user.repository';
import * as bcrypt from 'bcrypt';

export class CreateExampleUsers implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const [adminSalt, customerSalt] = await Promise.all([
      bcrypt.genSalt(),
      bcrypt.genSalt(),
    ]);

    try {
      await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          {
            username: 'admin',
            firstName: 'admin',
            lastName: 'admin',
            email: 'admin@example.com',
            salt: adminSalt,
            password: await this.hashPassword('P@ssw0rd', adminSalt),
          },
          {
            username: 'customer',
            firstName: 'customer',
            lastName: 'customer',
            email: 'customer@example.com',
            salt: customerSalt,
            password: await this.hashPassword('P@ssw0rd', customerSalt),
          },
        ])
        .execute();
    } catch (error) {}
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
