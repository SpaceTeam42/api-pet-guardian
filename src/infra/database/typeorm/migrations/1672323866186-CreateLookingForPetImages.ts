import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLookingForPetImages1672323866186
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'looking_for_pet_images',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'looking_for_pet_id',
            type: 'uuid',
          },
          {
            name: 'image',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FKLookingForPetsImageLookingForPet',
            referencedTableName: 'looking_for_pets',
            referencedColumnNames: ['id'],
            columnNames: ['looking_for_pet_id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('looking_for_pet_images');
  }
}
