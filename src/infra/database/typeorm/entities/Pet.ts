import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { v4 as uuidV4 } from 'uuid';

import { Expose } from 'class-transformer';

import uploadConfig from '@config/upload';

import { Category } from '@infra/database/typeorm/entities/Category';
import { Tutor } from '@infra/database/typeorm/entities/Tutor';
import { PetImage } from '@infra/database/typeorm/entities/PetImage';

export enum PetGenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

enum PetSizeEnum {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  BIG = 'BIG',
}

@Entity('pets')
export class Pet {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  birthday: Date;

  @Column()
  breed: string;

  @Column('uuid')
  category_id: string;

  @Column()
  gender: string;

  @Column()
  size: string;

  @Column()
  weight: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  avatar: string;

  @Column('uuid')
  tutor_id: string;

  @Column()
  adopted: boolean;

  @Column()
  description: string;

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

  static getPetSizeEnum(size: string): PetSizeEnum | '' {
    switch (size) {
      case PetSizeEnum.SMALL:
        return PetSizeEnum.SMALL;
      case PetSizeEnum.MEDIUM:
        return PetSizeEnum.MEDIUM;
      case PetSizeEnum.BIG:
        return PetSizeEnum.BIG;
      default:
        return '';
    }
  }

  // RELATIONS
  @ManyToOne(() => Category, (category) => category.pets)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Tutor, (tutor) => tutor.pets)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @OneToMany(() => PetImage, (petImage) => petImage.pet)
  @JoinColumn({ name: 'pet_id' })
  pet_images: PetImage[];
}
