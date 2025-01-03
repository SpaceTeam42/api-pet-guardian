import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { IHashComparer } from '../../cryptography/hash-comparer';
import { IHashGenerator } from '../../cryptography/hash-generator';

import { IWritersRepository } from '../../repositories/v1/writers-repository';

interface IRequest {
  id: string;
  oldPassword: string;
  password: string;
}

@injectable()
export class UpdateWriterPasswordUseCase {
  constructor(
    @inject('WritersRepository')
    private writersRepository: IWritersRepository,

    @inject('HashGeneratorProvider')
    private hashGenerator: IHashGenerator,

    @inject('HashComparerProvider')
    private hashComparer: IHashComparer,
  ) {}

  async execute({ id, oldPassword, password }: IRequest): Promise<void> {
    const writer = await this.writersRepository.findById(id);

    if (!writer || writer.enabled === false) {
      throw new AppError('Writer not found!', 404);
    }

    if (password && !oldPassword) {
      throw new AppError(
        'You need to inform the old password to set a new password',
        400,
      );
    }

    const checkOldPassword = await this.hashComparer.compare(
      oldPassword,
      writer.password,
    );

    if (!checkOldPassword) {
      throw new AppError('Old password does not match', 400);
    }

    writer.password = await this.hashGenerator.hash(password);

    await this.writersRepository.save(writer);
  }
}
