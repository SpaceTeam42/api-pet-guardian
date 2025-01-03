import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { IHashComparer } from '../../cryptography/hash-comparer';

import { IWritersRepository } from '../../repositories/v1/writers-repository';

interface IRequest {
  authenticatedWriterId: string;
  email: string;
  password: string;
}

@injectable()
export class DeleteWriterUseCase {
  constructor(
    @inject('WritersRepository')
    private writersRepository: IWritersRepository,

    @inject('HashComparerProvider')
    private hashComparer: IHashComparer,
  ) {}

  async execute({
    authenticatedWriterId,
    email,
    password,
  }: IRequest): Promise<void> {
    const writer = await this.writersRepository.findByEmail(email);

    if (!writer || writer.enabled === false) {
      throw new AppError('E-mail or password incorrect!', 404);
    }

    if (authenticatedWriterId !== writer.id) {
      throw new AppError('E-mail or password incorrect!', 404);
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      writer.password,
    );

    if (!passwordMatch) {
      throw new AppError('E-mail or password incorrect!', 404);
    }

    await this.writersRepository.delete(writer.id);
  }
}
