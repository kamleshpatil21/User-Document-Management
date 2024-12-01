import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { typeOrmConfig } from 'src/db/typeorm.config';

describe('UsersService (Integration Test)', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create and find a user', async () => {
    const user = { username: 'JohnDoe', password: 'password' };
    const newUser = await service.create(user);

    const foundUser = await service.findOne(newUser.id);
    expect(foundUser).toHaveProperty('id');
    expect(foundUser).toBe(user);
  });

  it('should update an existing user', async () => {
    const user = { username: 'JohnDoe', password: 'password' };
    const newUser = await service.create(user);

    const updates = { email: 'UpdatedJohnDoe' };
    const updatedUser = await service.update(newUser.id, updates);
    
    expect(updatedUser).toBe(updates);
  });

  it('should delete a user', async () => {
    const user = { username: 'JohnDoe', password: 'password' };
    const newUser = await service.create(user);
    
    const response = await service.remove(newUser.id);
    expect(response.message).toBe(`User with ID ${newUser.id} deleted successfully`);
  });
});
