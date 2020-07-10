import { Role } from '../../users/entities/role.entity';
import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Logger } from '@nestjs/common';

export class CreateRoles implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    try {
      await connection
        .createQueryBuilder()
        .insert()
        .into(Role)
        .values([{ label: 'admin' }, { label: 'customer' }])
        .execute();
    } catch (error) {}
  }
}
