import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Movie } from '../entities';

export class CreateMovie1594001537 implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Movie)().createMany(25);
  }
}
