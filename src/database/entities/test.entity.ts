import { Entity, BaseEntity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Test extends BaseEntity {
  @PrimaryColumn()
  name: string;

  @Column()
  test: string;
}
