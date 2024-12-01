import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from 'src/db/typeorm.config';

describe('AuthService Integration', () => {
  let authService: AuthService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [AuthService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const result = await authService.register({ email: 'test@test.com', password: '123456', role: 'viewer' });
      expect(result.email).toBe('test@test.com');
    });

    it('should throw an error if the email is already registered', async () => {
      await expect(
        authService.register({ email: 'test@test.com', password: '123456', role: 'viewer' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const result = await authService.login({ email: 'test@test.com', password: '123456' });
      expect(result).toBeDefined();
    });

    it('should throw an error for invalid credentials', async () => {
      await expect(authService.login({ email: 'wrong@test.com', password: 'wrongPassword' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
