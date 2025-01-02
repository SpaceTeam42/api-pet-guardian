import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { INewsRepository } from '../../repositories/v1/news-repository';

interface IRequest {
  title: string;
  description: string;
  content: string;
  writerId: string;
}

@injectable()
export class NewsRepository {
  constructor(
    @inject('NewsRepository')
    private newsRepository: INewsRepository,
  ) {}

  async execute() {}
}
