import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@app/user/dto/createUserDto';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from '@app/types/userResponse.interface';
import { LoginUserDto } from '@app/user/dto/LoginUserDto';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {} // Replace 'any' with actual repository type

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    // Logic to create a user
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (userByEmail || userByUsername) {
      throw new HttpException(
        'User with this email or username already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    // Here you would typically save the newUser to the database
    console.log('User created:', newUser);

    return await this.userRepository.save(newUser);
  }

  private generateJwt(user: UserEntity): string {
    // Logic to generate JWT token for the user
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET as string,
    ) as string;
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    console.log('Building user response for:', user);
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    // Logic to authenticate a user
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isPasswordCorrect: boolean = await compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
  }
}
