import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

describe('UsersService (Unit Test)', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const result = [{ id: 1, username: 'JohnDoe' }];
    mockUserRepository.find.mockResolvedValue(result);
    
    const users = await service.findAll();
    expect(users).toEqual(result);
  });

  it('should return one user by ID', async () => {
    const result = { id: 1, username: 'JohnDoe' };
    mockUserRepository.findOneBy.mockResolvedValue(result);
    
    const user = await service.findOne(1);
    expect(user).toEqual(result);
  });

  it('should create a new user', async () => {
    const user = { username: 'JohnDoe', password: 'password' };
    const result = { id: 1, ...user };
    mockUserRepository.create.mockReturnValue(result);
    mockUserRepository.save.mockResolvedValue(result);

    const newUser = await service.create(user);
    expect(newUser).toEqual(result);
  });

  it('should update an existing user', async () => {
    const updates = { email: 'UpdatedJohnDoe' };
    const result = { id: 1, username: 'UpdatedJohnDoe' };
    mockUserRepository.update.mockResolvedValue({ affected: 1 });
    mockUserRepository.findOneBy.mockResolvedValue(result);

    const updatedUser = await service.update(1, updates);
    expect(updatedUser).toEqual(result);
  });

  it('should remove a user', async () => {
    const id = 1;
    const result = { message: `User with ID ${id} deleted successfully` };
    mockUserRepository.delete.mockResolvedValue({ affected: 1 });

    const response = await service.remove(id);
    expect(response).toEqual(result);
  });
});
