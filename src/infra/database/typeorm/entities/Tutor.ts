import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { Expose, Exclude } from 'class-transformer';

import { Pet } from '@infra/database/typeorm/entities/Pet';
import { Adoption } from '@infra/database/typeorm/entities/Adoption';

import uploadConfig from '@config/upload';

enum TutorTypeEnum {
  ONG = 'ONG',
  PROTECTOR = 'PROTECTOR',
  TUTOR = 'TUTOR',
}

@Entity('tutors')
class Tutor {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  type: TutorTypeEnum;

  @Column()
  cnpj_cpf: string;

  @Column()
  manager_ong?: string;

  @Column()
  avatar?: string;

  @Column()
  personal_phone: string;

  @Column()
  personal_phone_is_whatsapp: boolean;

  @Column()
  public_phone?: string;

  @Column()
  public_phone_is_whatsapp?: boolean;

  @Column()
  enabled: boolean;

  @Column()
  street_name: string;

  @Column()
  street_number: string;

  @Column()
  complement?: string;

  @Column()
  neighborhood: string;

  @Column()
  postal_code: string;

  @Column()
  reference?: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }

  @Expose({ name: 'avatar_url' })
  getAvatarURL(): string | null {
    if (!this.avatar) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/${uploadConfig.tutorsFolder}/${this.avatar}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/${uploadConfig.tutorsFolder}/${this.avatar}`;
      default:
        return null;
    }
  }

  static getTutorTypeEnum(type: string): TutorTypeEnum | '' {
    switch (type) {
      case TutorTypeEnum.ONG:
        return TutorTypeEnum.ONG;
      case TutorTypeEnum.PROTECTOR:
        return TutorTypeEnum.PROTECTOR;
      case TutorTypeEnum.TUTOR:
        return TutorTypeEnum.TUTOR;
      default:
        return '';
    }
  }

  // RELATIONS
  @OneToMany(() => Pet, pet => pet.tutor)
  @JoinColumn({ name: 'tutor_id' })
  pets: Pet[];

  @OneToMany(() => Adoption, adoption => adoption.tutor)
  @JoinColumn({ name: 'tutor_id' })
  adoptions: Adoption[];
}

export { Tutor, TutorTypeEnum };
