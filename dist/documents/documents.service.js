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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_entity_1 = require("./entities/document.entity");
const fs_1 = require("fs");
const path_1 = require("path");
let DocumentsService = class DocumentsService {
    constructor(documentsRepository) {
        this.documentsRepository = documentsRepository;
    }
    async create(createDocumentDto) {
        const document = this.documentsRepository.create(createDocumentDto);
        return this.documentsRepository.save(document);
    }
    async findAll() {
        return this.documentsRepository.find();
    }
    async findOne(id) {
        const document = await this.documentsRepository.findOne({ where: { id } });
        if (!document) {
            throw new common_1.NotFoundException(`Document with ID ${id} not found`);
        }
        return document;
    }
    async update(id, updateDocumentDto) {
        const document = await this.findOne(id);
        Object.assign(document, updateDocumentDto);
        return this.documentsRepository.save(document);
    }
    async remove(id) {
        const document = await this.findOne(id);
        (0, fs_1.unlinkSync)((0, path_1.join)(__dirname, '..', '..', document.path));
        await this.documentsRepository.remove(document);
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map