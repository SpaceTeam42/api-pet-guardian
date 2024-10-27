import { UserTypeEnum } from '@infra/database/typeorm/entities/User';

export type ICreateUserDTO = {
  name: string;
  email: string;
  password: string;
  type: keyof typeof UserTypeEnum;
};
