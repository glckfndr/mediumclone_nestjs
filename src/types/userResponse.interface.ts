import { UserType } from '@app/types/user.type';

export interface UserResponseInterface {
  user: UserType & { token: string };
}
