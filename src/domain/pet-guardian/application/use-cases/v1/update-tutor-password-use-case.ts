import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { IHashComparer } from '../../cryptography/hash-comparer';
import { IHashGenerator } from '../../cryptography/hash-generator';

import { ITutorsRepository } from '../../repositories/v1/tutors-repository';

interface IRequest {
  id: string;
  oldPassword: string;
  password: string;
}

@injectable()
export class UpdateTutorPasswordUseCase {
  constructor(
    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,

    @inject('HashGeneratorProvider')
    private hashGenerator: IHashGenerator,

    @inject('HashComparerProvider')
    private hashComparer: IHashComparer,
  ) {}

  async execute({ id, oldPassword, password }: IRequest): Promise<void> {
    const tutor = await this.tutorsRepository.findById(id);

    if (!tutor || tutor.enabled === false) {
      throw new AppError('Tutor not found!', 404);
    }

    if (password && !oldPassword) {
      throw new AppError(
        'You need to inform the old password to set a new password',
        400,
      );
    }

    const checkOldPassword = await this.hashComparer.compare(
      oldPassword,
      tutor.password,
    );

    if (!checkOldPassword) {
      throw new AppError('Old password does not match', 400);
    }

    tutor.password = await this.hashGenerator.hash(password);

    await this.tutorsRepository.save(tutor);
  }
}
