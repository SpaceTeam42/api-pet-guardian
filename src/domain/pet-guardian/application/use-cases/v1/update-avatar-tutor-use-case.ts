import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { Tutor } from '@infra/database/typeorm/entities/Tutor';

import { ITutorsRepository } from '@domain/pet-guardian/application/repositories/v1/tutors-repository';
import { IStorage } from '@domain/pet-guardian/application/storage/storage';

interface IRequest {
  id: string;
  avatarFilename?: string;
}

interface IResponse {
  tutor: Tutor;
}

@injectable()
export class UpdateAvatarTutorUseCase {
  constructor(
    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,
    @inject('StorageProvider')
    private storageProvider: IStorage,
  ) {}

  async execute({ id, avatarFilename }: IRequest): Promise<IResponse> {
    const tutor = await this.tutorsRepository.findById(id);

    if (!tutor) {
      await this.storageProvider.delete(avatarFilename);

      throw new AppError('Tutor not found!', 404);
    }

    let avatarImage = null;
    if (avatarFilename) {
      if (tutor.avatar) {
        await this.storageProvider.delete(
          tutor.avatar,
          uploadConfig.tutorsFolder,
        );
      }

      avatarImage = await this.storageProvider.save(
        avatarFilename,
        uploadConfig.tutorsFolder,
      );
    }

    tutor.avatar = avatarImage;

    await this.tutorsRepository.save(tutor);

    return { tutor };
  }
}
