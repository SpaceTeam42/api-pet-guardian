import { inject } from 'tsyringe';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { IHashGenerator } from '../../cryptography/hash-generator';

import { IStorage } from '../../storage/storage';

import { ITutorsRepository } from '../../repositories/v1/tutors-repository';
import { Tutor, TutorTypeEnum } from '@infra/database/typeorm/entities/Tutor';

interface IRequest {
  name: string;
  email: string;
  password: string;
  type: keyof typeof TutorTypeEnum;
  cnpj_cpf: string;
  manager_ong?: string;
  avatar?: string;
  personal_phone: string;
  personal_phone_is_whatsapp: boolean;
  public_phone?: string;
  public_phone_is_whatsapp?: boolean;
  enabled: boolean;
  street_name: string;
  street_number: string;
  complement?: string;
  neighborhood: string;
  postal_code: string;
  reference?: string;
  state: string;
  city: string;
}

interface IResponse {
  tutor: Tutor;
}

export class CreateTutorUseCase {
  constructor(
    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,

    @inject('HashGeneratorProvider')
    private hashGenerator: IHashGenerator,

    @inject('StorageProvider')
    private storageProvider: IStorage,
  ) {}

  async execute({
    name,
    email,
    password,
    type,
    cnpj_cpf,
    manager_ong,
    avatar,
    personal_phone,
    personal_phone_is_whatsapp,
    public_phone,
    public_phone_is_whatsapp,
    enabled = true,
    street_name,
    street_number,
    complement,
    neighborhood,
    postal_code,
    reference,
    state,
    city,
  }: IRequest): Promise<IResponse> {
    const tutorExistsWithEmail = await this.tutorsRepository.findByEmail(email);

    if (tutorExistsWithEmail) {
      await this.storageProvider.delete(avatar, uploadConfig.tmpFolder);

      throw new AppError('E-mail already in use!', 400);
    }

    const tutorExistsWithCnpjCpf =
      await this.tutorsRepository.findByCnpjCpf(cnpj_cpf);

    if (tutorExistsWithCnpjCpf) {
      if (avatar) {
        await this.storageProvider.delete(avatar);
      }

      throw new AppError('CNPJ/CPF already in use!', 400);
    }

    if (Tutor.getTutorTypeEnum(type) === '') {
      if (avatar) {
        await this.storageProvider.delete(avatar);
      }

      throw new AppError('Perfil invalid!', 400);
    }

    const passwordHash = await this.hashGenerator.hash(password);

    let avatarImage = null;
    if (avatar) {
      avatarImage = await this.storageProvider.save(
        avatar,
        uploadConfig.tutorsFolder,
      );
    }

    const tutor = await this.tutorsRepository.create({
      name,
      email,
      password: passwordHash,
      type,
      cnpj_cpf,
      manager_ong,
      avatar: avatarImage,
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
    });

    return { tutor };
  }
}
