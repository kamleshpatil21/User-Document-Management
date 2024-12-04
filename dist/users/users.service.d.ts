import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UserData } from './entities/user.entity';
import { UpdateUserDataDto } from './dto/update-user-data.dto.ts';
import { CreateUserDataDto } from './dto/create-userdata.dto';
export declare class UsersService {
    private readonly UserDataRepository;
    private readonly userRepository;
    constructor(UserDataRepository: Repository<UserData>, userRepository: Repository<User>);
    findAll(): Promise<UserData[]>;
    findOne(id: number): Promise<UserData>;
    create(createUserDataDto: CreateUserDataDto): Promise<UserData>;
    update(id: number, updates: UpdateUserDataDto): Promise<UserData>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
