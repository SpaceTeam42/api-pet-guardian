import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { v4 as uuidV4 } from 'uuid';

import { Expose } from 'class-transformer';

import uploadConfig from '@config/upload';

import { Category } from '@infra/database/typeorm/entities/Category';
import { LookingForPetImage } from '@infra/database/typeorm/entities/LookingForPetImage';

export enum PetGenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity('looking_for_pets')
export class LookingForPet {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  name_pet: string;

  @Column('varchar')
  breed: string;

  @Column('varchar')
  gender: string;

  @Column('uuid')
  category_id: string;

  @Column('varchar')
  name_tutor: string;

  @Column('varchar')
  phone_tutor: string;

  @Column('boolean')
  phone_tutor_is_whatsapp: boolean;

  @Column('varchar')
  last_seen: string;

  @Column('text')
  description: string;

  @Column('boolean')
  is_found: boolean;

  @Column('boolean')
  is_reward: boolean;

  @Column('int')
  reward_amount: number;

  @Column('varchar')
  avatar: string;

  @Column('varchar')
  state: string;

  @Column('varchar')
  city: string;

  @Column('boolean')
  enabled: boolean;

  @Column('uuid')
  tutor_id: string;

  @Column('uuid')
  user_id: string;

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
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/${uploadConfig.petsFolder}/${this.avatar}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/${uploadConfig.petsFolder}/${this.avatar}`;
      default:
        return null;
    }
  }

  static getPetGenderEnum(gender: string): PetGenderEnum | '' {
    switch (gender) {
      case PetGenderEnum.MALE:
        return PetGenderEnum.MALE;
      case PetGenderEnum.FEMALE:
        return PetGenderEnum.FEMALE;
      default:
        return '';
    }
  }

  // RELATIONS
  @ManyToOne(() => Category, (category) => category.lookingForPet)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(
    () => LookingForPetImage,
    (lookingForPetImage) => lookingForPetImage.lookingForPet,
  )
  @JoinColumn({ name: 'looking_for_pet_id' })
  looking_for_pet_images: LookingForPetImage[];
}
