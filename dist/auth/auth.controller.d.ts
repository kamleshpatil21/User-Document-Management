import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: import("./entities/user.entity").User;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        token: string;
    }>;
    logout(req: any): Promise<{
        message: string;
        userId: any;
    }>;
    getRoles(req: any): Promise<{
        message: string;
        role: any;
    }>;
}
