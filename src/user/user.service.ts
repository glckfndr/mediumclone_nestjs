import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async createUser(): Promise<any> {
    // Logic to create a user
    return 'User created with userService';
  }
}
