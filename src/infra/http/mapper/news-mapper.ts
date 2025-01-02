import { IRequestNewsDTO } from '@domain/pet-guardian/application/dtos/request-news-map-dto';
import { IResponseNewsMapDTO } from '@domain/pet-guardian/application/dtos/response-news-map-dto';

export class NewsMapper {
  static toDTO({ news, writer }: IRequestNewsDTO): IResponseNewsMapDTO {
    const newsResponse: IResponseNewsMapDTO = {
      ...news,
      image_url: news.getImageUrl(),
      writer,
    };

    return newsResponse;
  }
}
