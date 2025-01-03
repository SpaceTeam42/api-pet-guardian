import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { IStorage } from '@domain/pet-guardian/application/storage/storage';

import { IWritersRepository } from '../../repositories/v1/writers-repository';

import { Writer } from '@infra/database/typeorm/entities/Writer';

interface IRequest {
  id: string;
  avatarFilename?: string;
}

interface IResponse {
  writer: Writer;
}

@injectable()
export class UpdateAvatarWriterUseCase {
  constructor(
    @inject('WritersRepository')
    private writersRepository: IWritersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorage,
  ) {}

  async execute({ id, avatarFilename }: IRequest): Promise<IResponse> {
    const writer = await this.writersRepository.findById(id);

    if (!writer) {
      await this.storageProvider.delete(avatarFilename);

      throw new AppError('Writer not found!', 404);
    }

    let avatarImage = null;
    if (avatarFilename) {
      if (writer.avatar) {
        await this.storageProvider.delete(
          writer.avatar,
          uploadConfig.tutorsFolder,
        );
      }

      avatarImage = await this.storageProvider.save(
        avatarFilename,
        uploadConfig.writersFolder,
      );
    }

    writer.avatar = avatarImage;

    await this.writersRepository.save(writer);

    return { writer };
  }
}
