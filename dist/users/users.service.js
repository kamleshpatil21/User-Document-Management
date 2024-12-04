"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const user_entity_2 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(UserDataRepository, userRepository) {
        this.UserDataRepository = UserDataRepository;
        this.userRepository = userRepository;
    }
    findAll() {
        return this.UserDataRepository.find();
    }
    findOne(id) {
        return this.UserDataRepository.findOneBy({ id });
    }
    async create(createUserDataDto) {
        const user = await this.userRepository.findOne({
            where: { id: createUserDataDto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${createUserDataDto.userId} not found`);
        }
        const newUserData = this.UserDataRepository.create({
            ...createUserDataDto,
            user,
        });
        return this.UserDataRepository.save(newUserData);
    }
    async update(id, updates) {
        const existingUserData = await this.UserDataRepository.findOneBy({ id });
        if (!existingUserData) {
            throw new common_1.NotFoundException(`UserData with ID ${id} not found`);
        }
        if (updates.userId) {
            const user = await this.userRepository.findOneBy({ id: updates.userId });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${updates.userId} not found`);
            }
            updates = { ...updates, user };
            delete updates.userId;
        }
        const result = await this.UserDataRepository.update(id, updates);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Failed to update UserData with ID ${id}`);
        }
        return this.UserDataRepository.findOne({
            where: { id },
            relations: ['user'],
        });
    }
    async remove(id) {
        const existingUserData = await this.UserDataRepository.findOneBy({ id });
        if (!existingUserData) {
            throw new common_1.NotFoundException(`UserData with ID ${id} not found`);
        }
        await this.UserDataRepository.delete(id);
        return { message: `UserData with ID ${id} deleted successfully` };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_2.UserData)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map