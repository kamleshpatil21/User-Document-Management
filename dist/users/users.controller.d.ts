import { UsersService } from './users.service';
import { User } from 'src/auth/entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    create(createUserDto: Partial<User>): Promise<User>;
    update(id: number, updates: Partial<User>): Promise<User>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
