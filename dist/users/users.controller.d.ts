import { UsersService } from './users.service';
import { CreateUserDataDto } from './dto/create-userdata.dto';
import { UpdateUserDataDto } from './dto/update-user-data.dto.ts';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./entities/user.entity").UserData[]>;
    create(createUserDto: CreateUserDataDto): Promise<import("./entities/user.entity").UserData>;
    update(id: number, updates: UpdateUserDataDto): Promise<import("./entities/user.entity").UserData>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
