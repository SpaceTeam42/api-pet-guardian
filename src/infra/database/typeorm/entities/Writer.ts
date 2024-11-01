import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { v4 as uuidV4 } from 'uuid';

import { Exclude, Expose } from 'class-transformer';

import uploadConfig from '@config/upload';

@Entity('writers')
class Writer {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Exclude()
  @Column('varchar')
  password: string;

  @Column('varchar')
  avatar?: string;

  @Column('varchar')
  instagram?: string;

  @Column('boolean')
  enabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @Expose({ name: 'avatar_url ' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/${uploadConfig.writersFolder}/${this.avatar}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/${uploadConfig.writersFolder}/${this.avatar}`;
      default:
        return null;
    }
  }

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Writer };
