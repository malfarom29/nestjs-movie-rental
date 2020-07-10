import { User } from '../../users/entities/user.entity';
import { Role } from '../../users/entities/role.entity';
import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export class RoleAssignation implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const [adminRole, customerRole] = await Promise.all([
      Role.findOne({ label: 'admin' }),
      Role.findOne({ label: 'customer' }),
    ]);
    const [admin, customer] = await Promise.all([
      User.findOne({ username: 'admin' }),
      User.findOne({ username: 'customer' }),
    ]);

    admin.roles = [adminRole];
    customer.roles = [customerRole];

    await Promise.all([admin.save(), customer.save()]);
  }
}
