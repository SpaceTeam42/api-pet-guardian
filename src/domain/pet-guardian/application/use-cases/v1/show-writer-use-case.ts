import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { IWritersRepository } from '../../repositories/v1/writers-repository';

import { Writer } from '@infra/database/typeorm/entities/Writer';

interface IRequest {
  id: string;
}

interface IResponse {
  writer: Writer;
}

@injectable()
export class ShowWriterUseCase {
  constructor(
    @inject('WritersRepository')
    private writersRepository: IWritersRepository,
  ) {}

  async execute({ id }: IRequest): Promise<IResponse> {
    const writer = await this.writersRepository.findById(id);

    if (!writer) {
      throw new AppError('Writer not found!', 404);
    }

    return { writer };
  }
}
