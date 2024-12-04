import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../auth/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDataDto } from './dto/create-userdata.dto';
import { UpdateUserDataDto } from './dto/update-user-data.dto.ts';

@ApiTags('Users') // Grouping the endpoints under the 'Users' tag in Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users (admin only)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden, admin access required' })
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Create a new user (admin only)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: User }) // Define the body schema for the create request
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden, admin access required' })
  create(@Body() createUserDto: CreateUserDataDto) {


    try {
      return this.usersService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
    
  }

  /**
   * Update a user by ID (admin only)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Update user details' })
  @ApiParam({ name: 'id', description: 'ID of the user to update' })
  @ApiBody({ type: User })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden, admin access required' })
  update(@Param('id') id: number, @Body() updates: UpdateUserDataDto) {
    return this.usersService.update(id, updates);
  }

  /**
   * Delete a user by ID (admin only)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'ID of the user to delete' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden, admin access required' })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
