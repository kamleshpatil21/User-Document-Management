import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UserData } from './entities/user.entity';
import { UpdateUserDataDto } from './dto/update-user-data.dto.ts';
import { CreateUserDataDto } from './dto/create-userdata.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserData)
    private readonly UserDataRepository: Repository<UserData>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
  ) {}

  findAll() {
    return this.UserDataRepository.find();
  }

  findOne(id: number) {
    return this.UserDataRepository.findOneBy({ id });
  }

  async create(createUserDataDto: CreateUserDataDto) {
    // Find the User entity based on userId provided in DTO
    const user = await this.userRepository.findOne({
      where: { id: createUserDataDto.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createUserDataDto.userId} not found`);
    }

    // Create a new UserData entity and set the user relationship
    const newUserData = this.UserDataRepository.create({
      ...createUserDataDto,
      user, // Set the User entity in the relationship
    });

    // Save and return the newly created UserData
    return this.UserDataRepository.save(newUserData);
  }

  async update(id: number, updates: UpdateUserDataDto) {
    // Check if the UserData entity exists
    const existingUserData = await this.UserDataRepository.findOneBy({ id });
    if (!existingUserData) {
      throw new NotFoundException(`UserData with ID ${id} not found`);
    }

    if (updates.userId) {
      // Check if the referenced User exists
      const user = await this.userRepository.findOneBy({ id: updates.userId });
      if (!user) {
        throw new NotFoundException(`User with ID ${updates.userId} not found`);
      }

      // Add the User entity to updates
      updates = { ...updates, user } as any; // Type assertion for dynamic updates
      delete updates.userId; // Remove userId after resolving the relation
    }

    // Perform the update
    const result = await this.UserDataRepository.update(id, updates);
    if (result.affected === 0) {
      throw new NotFoundException(`Failed to update UserData with ID ${id}`);
    }

    // Return the updated UserData entity with its relations
    return this.UserDataRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
  


 async remove(id: number) {
  // Check if the user data exists
  const existingUserData = await this.UserDataRepository.findOneBy({ id });
  if (!existingUserData) {
    throw new NotFoundException(`UserData with ID ${id} not found`);
  }

  // Proceed with deletion
  await this.UserDataRepository.delete(id);
  return { message: `UserData with ID ${id} deleted successfully` };
}
}
