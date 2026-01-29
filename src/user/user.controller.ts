import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUserDto';

import type { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDto } from '@app/user/dto/LoginUserDto';

import { User } from '@app/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UpdateUserDto } from '@app/user/dto/updateUserDto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  getCurrentUser(@User() user: UserEntity): UserResponseInterface {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User() currentUser: UserEntity,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const updatedUser = await this.userService.updateUser(
      currentUser,
      updateUserDto,
    );
    return this.userService.buildUserResponse(updatedUser);
  }
}
