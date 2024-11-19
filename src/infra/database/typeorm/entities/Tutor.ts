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

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  @Exclude()
  password: string;

  @Column('varchar')
  type: keyof typeof TutorTypeEnum;

  @Column('varchar')
  cnpj_cpf: string;

  @Column('varchar')
  manager_ong?: string;

  @Column('varchar')
  avatar?: string;

  @Column('varchar')
  personal_phone: string;

  @Column('varchar')
  personal_phone_is_whatsapp: boolean;

  @Column('varchar')
  public_phone?: string;

  @Column('varchar')
  public_phone_is_whatsapp?: boolean;

  @Column('boolean')
  enabled: boolean;

  @Column('varchar')
  street_name: string;

  @Column('varchar')
  street_number: string;

  @Column('varchar')
  complement?: string;

  @Column('varchar')
  neighborhood: string;

  @Column('varchar')
  postal_code: string;

  @Column('varchar')
  reference?: string;

  @Column('varchar')
  state: string;

  @Column('varchar')
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
  @OneToMany(() => Pet, (pet) => pet.tutor)
  @JoinColumn({ name: 'tutor_id' })
  pets: Pet[];

  @OneToMany(() => Adoption, (adoption) => adoption.tutor)
  @JoinColumn({ name: 'tutor_id' })
  adoptions: Adoption[];
}

export { Tutor, TutorTypeEnum };
