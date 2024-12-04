import { IsOptional, IsString, IsPhoneNumber, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDataDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+911234567890',
    required: false,
  })
  @IsPhoneNumber('IN') // For validating Indian phone numbers
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Foreign key of the associated user',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  userId?: number; // Foreign key referencing the User entity
}
