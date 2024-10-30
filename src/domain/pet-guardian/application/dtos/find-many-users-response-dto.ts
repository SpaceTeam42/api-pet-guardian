import { User } from '@infra/database/typeorm/entities/User';

export interface IFindManyUsersResponseDTO {
  totalUsers: number;
  users: User[];
}
