import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@app/user/dto/createUserDto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {} // Replace 'any' with actual repository type

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    // Logic to create a user
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    // Here you would typically save the newUser to the database
    console.log('User created:', newUser);

    return await this.userRepository.save(newUser);
  }

  private generateJwt(user: UserEntity): string {
    // Logic to generate JWT token for the user
    return 'jwt-token-placeholder';
  }

  buildUserResponse(user: UserEntity): any {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
