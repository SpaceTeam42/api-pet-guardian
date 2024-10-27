import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFieldCategoryIdLookingForPet1702565657693
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'looking_for_pets',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('looking_for_pets', 'category_id');
  }
}
