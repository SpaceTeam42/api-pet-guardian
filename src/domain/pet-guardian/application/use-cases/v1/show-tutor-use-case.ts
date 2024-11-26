import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { Tutor } from '@infra/database/typeorm/entities/Tutor';

import { ITutorsRepository } from '../../repositories/v1/tutors-repository';

interface IRequest {
  id: string;
}

interface IResponse {
  tutor: Tutor;
}

@injectable()
export class ShowTutorUseCase {
  constructor(
    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,
  ) {}

  async execute({ id }: IRequest): Promise<IResponse> {
    const tutor = await this.tutorsRepository.findById(id);

    if (!tutor) {
      throw new AppError('Tutor not found!', 404);
    }

    return { tutor };
  }
}
