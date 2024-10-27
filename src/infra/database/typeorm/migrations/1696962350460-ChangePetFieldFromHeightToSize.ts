import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangePetFieldFromHeightToSize1696962350460
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('pets', 'height', 'size');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('pets', 'size', 'height');
  }
}
