import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // Import AuthorizationModule
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
