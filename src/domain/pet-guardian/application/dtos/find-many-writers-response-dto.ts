import { Writer } from '@infra/database/typeorm/entities/Writer';

export interface IFindManyWritersResponseDTO {
  totalWriters: number;
  writers: Writer[];
}
