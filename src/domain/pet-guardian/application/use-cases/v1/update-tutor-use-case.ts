import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { Tutor, TutorTypeEnum } from '@infra/database/typeorm/entities/Tutor';

import { ITutorsRepository } from '@domain/pet-guardian/application/repositories/v1/tutors-repository';

interface IRequest {
  id: string;
  name: string;
  email: string;
  type: keyof typeof TutorTypeEnum;
  cnpj_cpf: string;
  manager_ong?: string;
  personal_phone: string;
  personal_phone_is_whatsapp: boolean;
  public_phone?: string;
  public_phone_is_whatsapp?: boolean;
  street_name: string;
  street_number: string;
  complement?: string;
  neighborhood: string;
  postal_code?: string;
  reference?: string;
  state: string;
  city: string;
}

interface IResponse {
  tutor: Tutor;
}

@injectable()
export class UpdateTutorUseCase {
  constructor(
    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,
  ) {}

  async execute({
    id,
    name,
    email,
    type,
    cnpj_cpf,
    manager_ong,
    personal_phone,
    personal_phone_is_whatsapp,
    public_phone,
    public_phone_is_whatsapp,
    street_name,
    street_number,
    complement,
    neighborhood,
    postal_code,
    reference,
    state,
    city,
  }: IRequest): Promise<IResponse> {
    const tutor = await this.tutorsRepository.findById(id);

    if (!tutor) {
      throw new AppError('Tutor not found!', 404);
    }

    const tutorUpdatedWithEmail =
      await this.tutorsRepository.findByEmail(email);

    if (!tutorUpdatedWithEmail) {
      throw new AppError('Tutor not found!', 404);
    }

    if (tutorUpdatedWithEmail.id !== tutor.id) {
      throw new AppError('E-mail already in use!', 400);
    }

    if (Tutor.getTutorTypeEnum(type) === '') {
      throw new AppError('Perfil invalid!', 400);
    }

    tutor.name = name;
    tutor.email = email;
    tutor.type = type;
    tutor.cnpj_cpf = cnpj_cpf;
    tutor.manager_ong = manager_ong;
    tutor.personal_phone = personal_phone;
    tutor.personal_phone_is_whatsapp = personal_phone_is_whatsapp;
    tutor.public_phone = public_phone;
    tutor.public_phone_is_whatsapp = public_phone_is_whatsapp;
    tutor.street_name = street_name;
    tutor.street_number = street_number;
    tutor.complement = complement;
    tutor.neighborhood = neighborhood;
    tutor.postal_code = postal_code;
    tutor.reference = reference;
    tutor.state = state;
    tutor.city = city;

    await this.tutorsRepository.save(tutor);

    return { tutor };
  }
}
