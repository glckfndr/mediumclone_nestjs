import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/createUserDto';

@Injectable()
export class UserService {
  async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    // Logic to create a user
    return createUserDto;
  }
}
