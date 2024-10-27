import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { v4 as uuidV4 } from 'uuid';

import { User } from './User';

@Entity('users_refreshes_tokens')
class UserRefreshToken {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  refresh_token: string;

  @Column('uuid')
  user_id: string;

  @Column()
  expires_date: Date;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

export { UserRefreshToken };
