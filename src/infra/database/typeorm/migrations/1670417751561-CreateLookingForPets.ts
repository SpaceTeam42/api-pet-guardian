import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLookingForPets1670417751561 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'looking_for_pets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'name_pet',
            type: 'varchar',
          },
          {
            name: 'breed',
            type: 'varchar',
          },
          {
            name: 'gender',
            type: 'varchar',
          },
          {
            name: 'name_tutor',
            type: 'varchar',
          },
          {
            name: 'phone_tutor',
            type: 'varchar',
          },
          {
            name: 'phone_tutor_is_whatsapp',
            type: 'boolean',
          },
          {
            name: 'last_seen',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'is_found',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_reward',
            type: 'boolean',
            default: false,
          },
          {
            name: 'reward_amount',
            type: 'numeric',
            default: 0,
          },
          {
            name: 'avatar',
            type: 'varchar',
          },
          {
            name: 'state',
            type: 'varchar',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'enabled',
            type: 'boolean',
            default: false,
          },
          {
            name: 'tutor_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('looking_for_pets');
  }
}
