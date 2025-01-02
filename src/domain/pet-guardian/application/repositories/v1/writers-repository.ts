import { ICreateWriterDTO } from '../../dtos/create-writer-dto';

import { IFindManyWritersParametersDTO } from '../../dtos/find-many-writers-parameters-dto';
import { IFindManyWritersResponseDTO } from '../../dtos/find-many-writers-response-dto';

import { Writer } from '@infra/database/typeorm/entities/Writer';

export interface IWritersRepository {
  create({
    name,
    email,
    password,
    instagram,
  }: ICreateWriterDTO): Promise<Writer>;
  findMany({
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyWritersParametersDTO): Promise<IFindManyWritersResponseDTO>;
  findById(id: string): Promise<Writer | undefined>;
  findByEmail(email: string): Promise<Writer | undefined>;
  save(writer: Writer): Promise<Writer>;
  delete(id: string): Promise<void>;
}
