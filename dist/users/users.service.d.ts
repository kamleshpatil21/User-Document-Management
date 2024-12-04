import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    create(user: Partial<User>): Promise<User>;
    update(id: number, updates: Partial<User>): Promise<User>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
