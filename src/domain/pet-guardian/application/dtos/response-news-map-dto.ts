import { Writer } from '@infra/database/typeorm/entities/Writer';

export type IResponseNewsMapDTO = {
  id: string;
  title: string;
  description: string;
  content: string;
  writer_id: string;
  image: string;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
  image_url: string | null;
  writer: Writer;
};
