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

import { Expose } from 'class-transformer';

import uploadConfig from '@config/upload';

import { Pet } from '@infra/database/typeorm/entities/Pet';
import { LookingForPet } from '@infra/database/typeorm/entities/LookingForPet';

@Entity('categories')
export class Category {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  icon?: string;

  @Column('boolean')
  enabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'icon_url' })
  getIconUrl(): string | null {
    if (!this.icon) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/${uploadConfig.categoriesFolder}/${this.icon}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/${uploadConfig.categoriesFolder}/${this.icon}`;
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
  @OneToMany(() => Pet, (pet) => pet.category)
  @JoinColumn({ name: 'category_id' })
  pets: Pet[];

  @OneToMany(() => LookingForPet, (lookingForPet) => lookingForPet.category)
  @JoinColumn({ name: 'category_id' })
  lookingForPet: LookingForPet[];
}
