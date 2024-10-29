import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { v4 as uuidV4 } from 'uuid';

import { Writer } from '@infra/database/typeorm/entities/Writer';

@Entity('writers_refreshes_tokens')
class WriterRefreshToken {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  refresh_token: string;

  @Column('uuid')
  writer_id: string;

  @Column('date')
  expires_date: Date;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }

  // RELATIONS
  @ManyToOne(() => Writer)
  @JoinColumn({ name: 'writer_id' })
  writer: Writer;
}

export { WriterRefreshToken };
