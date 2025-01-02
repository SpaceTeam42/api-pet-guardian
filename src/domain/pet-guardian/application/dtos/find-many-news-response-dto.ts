import { News } from '@infra/database/typeorm/schemas/News';

export interface IFindManyNewsResponseDTO {
  totalNews: number;
  news: News[];
}
