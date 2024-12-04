import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<User>;
    login(loginDto: LoginDto): Promise<string>;
    private generateToken;
}
