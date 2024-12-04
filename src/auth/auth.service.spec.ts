import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt'); // Global mock for bcrypt

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockToken'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should throw an error if the email is already registered', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({ email: 'test@test.com' } as User);

      await expect(
        authService.register({ email: 'test@test.com', password: '123456', role: 'viewer' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should hash the password and save the user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue({} as User);
      jest.spyOn(userRepository, 'save').mockResolvedValue({ id: 1, email: 'test@test.com' } as User);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await authService.register({ email: 'test@test.com', password: '123456', role: 'viewer' });
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(result).toEqual({ id: 1, email: 'test@test.com' });
    });
  });

  describe('login', () => {
    it('should throw an error if the user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(authService.login({ email: 'test@test.com', password: '123456' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an error if the password is invalid', async () => {
      const mockUser = { email: 'test@test.com', password: 'hashedPassword' } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login({ email: 'test@test.com', password: 'wrongPassword' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    describe('login', () => {
      it('should return a JWT token if login is successful', async () => {
        const mockUser = { id: 1, email: 'test@test.com', password: 'hashedPassword', role: 'viewer' } as User;
    
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    
        const result = await authService.login({ email: 'test@test.com', password: '123456' });
        
        // Update the expected payload to use "sub" instead of "id"
        expect(jwtService.sign).toHaveBeenCalledWith({ sub: 1, role: 'viewer' });
        expect(result).toBe('mockToken');
      });
    });
    
  });
});
