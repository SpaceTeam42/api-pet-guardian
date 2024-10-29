import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { v4 as uuidV4 } from 'uuid';

import { Tutor } from '@infra/database/typeorm/entities/Tutor';
import { Pet } from '@infra/database/typeorm/entities/Pet';

@Entity('adoptions')
class Adoption {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  short_code: string;

  @Column('uuid')
  old_tutor_id: string;

  @Column('uuid')
  tutor_id: string;

  @Column('uuid')
  pet_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }

  // RELATIONS
  @ManyToOne(() => Tutor, (tutor) => tutor.adoptions)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @OneToOne(() => Pet)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;
}

export { Adoption };
