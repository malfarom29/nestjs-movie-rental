import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUserRoleRolesTable1593707774303
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_role_roles',
        columns: [
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'roleId',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('user_role_roles', [
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedTableName: 'role',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_role_roles');
    const [userFk, roleFk] = [
      table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1),
      table.foreignKeys.find(fk => fk.columnNames.indexOf('roleId') !== -1),
    ];
    await queryRunner.dropForeignKeys('user_role_roles', [userFk, roleFk]);
    await queryRunner.dropTable('user_role_roles');
  }
}
