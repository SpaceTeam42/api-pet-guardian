import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAdoptions1657311368776 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'adoptions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'short_code',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'old_tutor_id',
            type: 'uuid',
          },
          {
            name: 'tutor_id',
            type: 'uuid',
          },
          {
            name: 'pet_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FKAdoptionOldTutor',
            referencedTableName: 'tutors',
            referencedColumnNames: ['id'],
            columnNames: ['old_tutor_id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            name: 'FKAdoptionTutor',
            referencedTableName: 'tutors',
            referencedColumnNames: ['id'],
            columnNames: ['tutor_id'],
            onUpdate: 'SET NULL',
            onDelete: 'SET NULL',
          },
          {
            name: 'FKAdoptionPet',
            referencedTableName: 'pets',
            referencedColumnNames: ['id'],
            columnNames: ['pet_id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('adoptions');
  }
}
