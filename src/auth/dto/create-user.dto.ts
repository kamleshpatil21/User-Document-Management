import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account, must be at least 6 characters long',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The role of the user, optional, can be "admin", "editor", or "viewer"',
    example: 'admin',
    required: false, // Make it optional
  })
  @IsOptional()
  @IsString()
  role?: 'admin' | 'editor' | 'viewer';
}
