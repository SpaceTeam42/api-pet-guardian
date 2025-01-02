import { ObjectId } from 'typeorm';

import { ICreateNewsDTO } from '../../dtos/create-news-dto';
import { IFindManyNewsParametersDTO } from '../../dtos/find-many-news-parameters-dto';
import { IFindManyNewsResponseDTO } from '../../dtos/find-many-news-response-dto';
import { IFindManyNewsWriterParametersDTO } from '../../dtos/find-many-news-writer-parameters-dto';

import { News } from '@infra/database/typeorm/schemas/News';

export interface INewsRepository {
  create({
    title,
    description,
    content,
    writer_id,
    image,
    enabled,
  }: ICreateNewsDTO): Promise<News>;
  findMany({
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyNewsParametersDTO): Promise<IFindManyNewsResponseDTO>;
  findById(id: string): Promise<News | undefined>;
  findManyByWriterId({
    writerId,
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyNewsWriterParametersDTO): Promise<IFindManyNewsResponseDTO>;
  save(news: News): Promise<News>;
  delete(id: ObjectId): Promise<void>;
}
