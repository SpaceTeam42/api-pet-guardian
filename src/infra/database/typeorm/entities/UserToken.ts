import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { v4 as uuidV4 } from 'uuid';

@Entity('user_tokens')
class UserToken {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  token: string;

  @Column('uuid')
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id && !this.token) {
      this.id = uuidV4();
      this.token = uuidV4();
    }
  }
}

export { UserToken };
