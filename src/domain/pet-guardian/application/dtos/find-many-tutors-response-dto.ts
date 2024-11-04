import { Tutor } from '@infra/database/typeorm/entities/Tutor';

export interface IFindManyTutorsResponseDTO {
  totalTutors: number;
  tutors: Tutor[];
}
