import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { v4 as uuidV4 } from 'uuid';

import { Expose } from 'class-transformer';

import uploadConfig from '@config/upload';

import { Pet } from './Pet';

@Entity('pet_images')
export class PetImage {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  pet_id: string;

  @Column()
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @Expose({ name: 'image_url' })
  getImageURL(): string | null {
    if (!this.image) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/${uploadConfig.petsFolder}/${this.image}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/${uploadConfig.petsFolder}/${this.image}`;
      default:
        return null;
    }
  }

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }

  // RELATIONS
  @ManyToOne(() => Pet, (pet) => pet.pet_images)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;
}
