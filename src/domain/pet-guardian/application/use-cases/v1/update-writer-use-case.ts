import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { IWritersRepository } from '../../repositories/v1/writers-repository';

import { Writer } from '@infra/database/typeorm/entities/Writer';

interface IRequest {
  id: string;
  name: string;
  email: string;
  instagram: string;
  enabled: boolean;
}

interface IResponse {
  writer: Writer;
}

@injectable()
export class UpdateWriterUseCase {
  constructor(
    @inject('WritersRepository')
    private writersRepository: IWritersRepository,
  ) {}

  async execute({
    id,
    name,
    email,
    instagram,
    enabled,
  }: IRequest): Promise<IResponse> {
    const writer = await this.writersRepository.findById(id);

    if (!writer) {
      throw new AppError('Writer not found!', 404);
    }

    const writerExistsWithEmail =
      await this.writersRepository.findByEmail(email);

    if (writerExistsWithEmail && writerExistsWithEmail.id !== writer.id) {
      throw new AppError('E-mail already in use!', 400);
    }

    writer.name = name;
    writer.email = email;
    writer.instagram = instagram;
    writer.enabled = enabled;

    await this.writersRepository.save(writer);

    return { writer };
  }
}
