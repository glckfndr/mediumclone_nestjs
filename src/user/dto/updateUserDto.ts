import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  private email: string;
  bio: string;
  image: string;
}
