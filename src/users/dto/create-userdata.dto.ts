import { IsNotEmpty, IsString, IsPhoneNumber, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDataDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+911234567890',
  })
  @IsPhoneNumber('IN') // For validating Indian phone numbers
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Foreign key of the associated user',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number; // Foreign key referencing the User entity
}
