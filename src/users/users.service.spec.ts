import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UserData } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDataDto } from './dto/create-userdata.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userDataRepository: Repository<UserData>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserData),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userDataRepository = module.get<Repository<UserData>>(getRepositoryToken(UserData));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create new UserData when user exists', async () => {
      const createUserDataDto: CreateUserDataDto = {
        userId: 1,
        name: 'Test Name',
        phoneNumber: '1234567890',
      };
    
      const mockUser = { id: 1 } as User;
      const mockUserData: UserData = {
        id: 1,
        name: 'Test Name',
        phoneNumber: '1234567890',
        user: mockUser,
        createDateTime: new Date(),
      };
    
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userDataRepository, 'create').mockReturnValue(mockUserData);
      jest.spyOn(userDataRepository, 'save').mockResolvedValue(mockUserData);
    
      const result = await service.create(createUserDataDto);
    
      expect(result).toEqual(mockUserData);
    
      // Match only the fields that `create` is called with
      expect(userDataRepository.save).toHaveBeenCalledWith(mockUserData);

    });

    it('should throw NotFoundException when user does not exist', async () => {
      const createUserDataDto = { name: 'Test Name', phoneNumber: '1234567890', userId: 1 };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createUserDataDto)).rejects.toThrow(
        new NotFoundException(`User with ID ${createUserDataDto.userId} not found`),
      );
    });
  });

  describe('update', () => {
    it('should update UserData when user and userData exist', async () => {
      const updates = { name: 'Updated Name', userId: 1 };
      const mockUser = { id: 1 } as User;
      const mockUserData = { id: 1, name: 'Old Name', user: mockUser } as UserData;

      jest.spyOn(userDataRepository, 'findOneBy').mockResolvedValue(mockUserData);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userDataRepository, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(userDataRepository, 'findOne').mockResolvedValue({ ...mockUserData, name: updates.name });

      const result = await service.update(1, updates);

      expect(result).toEqual({ ...mockUserData, name: updates.name });
      expect(userDataRepository.update).toHaveBeenCalledWith(1, { name: updates.name, user: mockUser });
    });

    it('should throw NotFoundException when UserData does not exist', async () => {
      jest.spyOn(userDataRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(1, { name: 'Updated Name' })).rejects.toThrow(
        new NotFoundException(`UserData with ID 1 not found`),
      );
    });

    it('should throw NotFoundException when User does not exist', async () => {
      const updates = { name: 'Updated Name', userId: 1 };
      const mockUserData = { id: 1, name: 'Old Name' } as UserData;

      jest.spyOn(userDataRepository, 'findOneBy').mockResolvedValue(mockUserData);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(1, updates)).rejects.toThrow(
        new NotFoundException(`User with ID ${updates.userId} not found`),
      );
    });
  });

  describe('remove', () => {
    it('should delete UserData when it exists', async () => {
      const mockUserData = { id: 1, name: 'Test Name' } as UserData;

      jest.spyOn(userDataRepository, 'findOneBy').mockResolvedValue(mockUserData);
      jest.spyOn(userDataRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      const result = await service.remove(1);

      expect(result).toEqual({ message: `UserData with ID 1 deleted successfully` });
      expect(userDataRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when UserData does not exist', async () => {
      jest.spyOn(userDataRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(
        new NotFoundException(`UserData with ID 1 not found`),
      );
    });
  });
});
