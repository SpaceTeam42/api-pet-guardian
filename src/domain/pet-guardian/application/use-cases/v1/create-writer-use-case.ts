import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { IWritersRepository } from '../../repositories/v1/writers-repository';
import { IHashGenerator } from '../../cryptography/hash-generator';

import { Writer } from '@infra/database/typeorm/entities/Writer';

interface IRequest {
  name: string;
  email: string;
  password: string;
  instagram?: string;
}

interface IResponse {
  writer: Writer;
}

@injectable()
export class CreateWriterUseCase {
  constructor(
    @inject('WritersRepository')
    private writersRepository: IWritersRepository,

    @inject('HashGeneratorProvider')
    private hashGenerator: IHashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    instagram,
  }: IRequest): Promise<IResponse> {
    const writerExistsWithEmail =
      await this.writersRepository.findByEmail(email);

    if (writerExistsWithEmail) {
      throw new AppError('Writer already exists!', 400);
    }

    const passwordHashed = await this.hashGenerator.hash(password);

    const writer = await this.writersRepository.create({
      name,
      email,
      password: passwordHashed,
      instagram,
    });

    return { writer };
  }
}
