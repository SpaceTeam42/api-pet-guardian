import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { v4 as uuidV4 } from 'uuid';

import { Tutor } from './Tutor';

@Entity('tutors_refreshes_tokens')
export class TutorRefreshToken {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  refresh_token: string;

  @Column('uuid')
  tutor_id: string;

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
  @ManyToOne(() => Tutor)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;
}
