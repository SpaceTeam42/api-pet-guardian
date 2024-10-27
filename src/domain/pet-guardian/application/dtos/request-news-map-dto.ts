import { Writer } from '@infra/database/typeorm/entities/Writer';

import { News } from '@infra/database/typeorm/schemas/News';

export type IRequestNewsDTO = {
  writer: Writer;
  news: News;
};
