import { BaseEntity, PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

@Entity()
export class MovieAttachment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  key: string;

  @Column()
  fileType: string;

  @Column()
  mimeType: string;
}
