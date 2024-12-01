import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RolesGuard } from './guards/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication') // Tag for Swagger grouping
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' }) // Description for this operation
  @ApiBody({ type: CreateUserDto }) // Specifies that the body should be a CreateUserDto
  @ApiResponse({ status: 201, description: 'User registered successfully.' }) // Response details for success
  @ApiResponse({ status: 400, description: 'Bad Request' }) // Response details for failure
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  /**
   * Login and generate a JWT token
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and generate JWT token' }) // Description for this operation
  @ApiBody({ type: LoginDto }) // Specifies that the body should be a LoginDto
  @ApiResponse({ status: 200, description: 'Login successful.' }) // Response details for success
  @ApiResponse({ status: 401, description: 'Unauthorized' }) // Response details for failure
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return {
      message: 'Login successful',
      token,
    };
  }

  /**
   * Logout the user
   * (JWT revocation or token invalidation logic can be added here)
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout the user' }) // Description for this operation
  @ApiResponse({ status: 200, description: 'Logout successful.' }) // Response details for success
  @ApiResponse({ status: 401, description: 'Unauthorized' }) // Response details for failure
  async logout(@Req() req) {
    const userId = req.user.id;
    return {
      message: 'Logout successful',
      userId,
    };
  }

  /**
   * Get roles for the logged-in user
   */
  @Post('roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get roles for the logged-in user' }) // Description for this operation
  @ApiResponse({ status: 200, description: 'Role fetched successfully.' }) // Response details for success
  @ApiResponse({ status: 403, description: 'Forbidden' }) // Response details for failure
  async getRoles(@Req() req) {
    const { role } = req.user;
    return {
      message: 'Role fetched successfully',
      role,
    };
  }
}
