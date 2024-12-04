import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        role: 'admin',
      };

      const mockUser = { id: '1', ...createUserDto };
      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await authController.register(createUserDto);
      expect(result).toEqual({
        message: 'User registered successfully',
        user: mockUser,
      });
      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should login a user and return a token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = 'mockJwtToken';
      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await authController.login(loginDto);
      expect(result).toEqual({
        message: 'Login successful',
        token: mockToken,
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      const req = { user: { id: '1' } };
      const result = await authController.logout(req);
      expect(result).toEqual({
        message: 'Logout successful',
        userId: '1',
      });
    });
  });

  describe('getRoles', () => {
    it('should fetch roles for the logged-in user', async () => {
      const req = { user: { role: 'admin' } };
      const result = await authController.getRoles(req);
      expect(result).toEqual({
        message: 'Role fetched successfully',
        role: 'admin',
      });
    });
  });
});
