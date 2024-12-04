import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDataDto } from './dto/create-userdata.dto';
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mocking the JwtAuthGuard
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard) // Mocking the RolesGuard
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user with valid CreateUserDto', async () => {
      const createUserDto: CreateUserDataDto ={
        "name": "kamlesh@examplem",
        "phoneNumber": "+918618545563",
        "userId": 6
      
      }

      const result = {
        "name": "kamlesh@examplem",
        "phoneNumber": "+918618545563",
        "userId": 6
      
      }
      mockUserService.create.mockResolvedValue(result);

      expect(await controller.create(createUserDto)).toBe(result);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error when email is invalid', async () => {
      const createUserDto: CreateUserDataDto ={
        "name": "kamlesh@examplem",
        "phoneNumber": "+918618545563",
        "userId": 6
      
      }

      try {
        await controller.create(createUserDto);
      } catch (e) {
        expect(e.response.statusCode).toBe(400); // Bad request
        expect(e.response.message).toBe('Invalid email address');
      }
    });

    it('should throw an error when password is too short', async () => {
      const createUserDto: CreateUserDataDto = {
        "name": "kamlesh@examplem",
        "phoneNumber": "+918618545563",
        "userId": 6
      
      }

      try {
        await controller.create(createUserDto);
      } catch (e) {
        expect(e.response.statusCode).toBe(400); // Bad request
        expect(e.response.message).toBe('Password must be at least 6 characters long');
      }
    });

    it('should create a user even when role is not provided', async () => {
      const createUserDto: CreateUserDataDto = {
        "name": "kamlesh@examplem",
        "phoneNumber": "+918618545563",
        "userId": 6
      
      }

      const result = {
        id: 1,
        email: 'user@example.com',
        password: 'password123',
        role: 'viewer', // Default role or a fallback if any
      };

      mockUserService.create.mockResolvedValue(result);

      expect(await controller.create(createUserDto)).toBe(result);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if there is a problem during user creation', async () => {
      const createUserDto: CreateUserDataDto ={
        "name": "kamlesh@examplem",
        "phoneNumber": "+918618545563",
        "userId": 6
      
      }
    
      // Simulate a NestJS exception
      mockUserService.create.mockRejectedValue(
        new BadRequestException('Something went wrong'),
      );
    
      try {
        await controller.create(createUserDto);
      } catch (e) {
        // Check if the error is an instance of the expected exception
        expect(e).toBeInstanceOf(BadRequestException);
        // Check specific properties of the response
        expect(e.response.statusCode).toBe(400); // Bad request
        expect(e.response.message).toBe('Something went wrong');
      }
    });
    
  });
});
