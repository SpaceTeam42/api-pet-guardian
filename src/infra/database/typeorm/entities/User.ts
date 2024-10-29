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

export enum UserTypeEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  WRITER = 'WRITER',
}

@Entity('users')
export class User {
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
  type: UserTypeEnum;

  @Column('boolean')
  enabled: boolean;

  @Column('varchar')
  avatar: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }

  @Expose({ name: 'avatar_url ' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/${uploadConfig.usersFolder}/${this.avatar}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/${uploadConfig.usersFolder}/${this.avatar}`;
      default:
        return null;
    }
  }

  static getUserTypeEnum(user_type: string): UserTypeEnum | '' {
    switch (user_type) {
      case UserTypeEnum.ADMIN:
        return UserTypeEnum.ADMIN;
      case UserTypeEnum.USER:
        return UserTypeEnum.USER;
      case UserTypeEnum.WRITER:
        return UserTypeEnum.WRITER;
      default:
        return '';
    }
  }
}
