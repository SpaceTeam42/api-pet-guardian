import { ICreateTutorDTO } from '../../dtos/create-tutor-dto';

import { Tutor } from '@infra/database/typeorm/entities/Tutor';
import { IFindManyTutorsParametersDTO } from '../../dtos/find-many-tutors-parameters-dto';
import { IFindManyTutorsResponseDTO } from '../../dtos/find-many-tutors-response-dto';

export interface ITutorsRepository {
  create({
    name,
    email,
    password,
    type,
    cnpj_cpf,
    manager_ong,
    personal_phone,
    personal_phone_is_whatsapp,
    public_phone,
    public_phone_is_whatsapp,
    enabled,
    street_name,
    street_number,
    complement,
    neighborhood,
    postal_code,
    reference,
    state,
    city,
  }: ICreateTutorDTO): Promise<Tutor>;
  findByEmail(email: string): Promise<Tutor | null>;
  findByCnpjCpf(cnpj_cpf: string): Promise<Tutor | null>;
  findMany({
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyTutorsParametersDTO): Promise<IFindManyTutorsResponseDTO>;
  findById(id: string): Promise<Tutor | null>;
  save(tutor: Tutor): Promise<Tutor>;
  delete(id: string): Promise<void>;
}
