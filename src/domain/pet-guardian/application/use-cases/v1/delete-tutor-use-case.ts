import { inject, injectable } from 'tsyringe';

import { IHashComparer } from '../../cryptography/hash-comparer';

import { ITutorsRepository } from '../../repositories/v1/tutors-repository';
import { AppError } from '@core/errors/AppError';

interface IRequest {
  authenticatedTutorId: string;
  email: string;
  password: string;
}

@injectable()
export class DeleteTutorUseCase {
  constructor(
    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,

    @inject('HashComparerProvider')
    private hashComparer: IHashComparer,
  ) {}

  async execute({
    authenticatedTutorId,
    email,
    password,
  }: IRequest): Promise<void> {
    const tutor = await this.tutorsRepository.findByEmail(email);

    if (!tutor || tutor.enabled === false) {
      throw new AppError('E-mail or password incorrect!', 404);
    }

    if (authenticatedTutorId !== tutor.id) {
      throw new AppError('E-mail or password incorrect!', 404);
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      tutor.password,
    );

    if (!passwordMatch) {
      throw new AppError('E-mail or password incorrect!', 404);
    }

    await this.tutorsRepository.delete(tutor.id);
  }
}
