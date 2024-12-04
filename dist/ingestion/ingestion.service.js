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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ingestion_entity_1 = require("./entities/ingestion.entity");
const axios_1 = __importDefault(require("axios"));
let IngestionService = class IngestionService {
    constructor(IngestionRepository) {
        this.IngestionRepository = IngestionRepository;
    }
    async triggerIngestionOperation(data) {
        try {
            console.log('Triggering ingestion operation for document ID:', data.documentId);
            await this.IngestionRepository.save(data);
            const response = await axios_1.default.post('http://python-service/ingest', {
                documentId: data.documentId,
                userId: data.userId,
                metadata: data.metadata,
            });
            if (response.status === 200) {
                return { success: true, message: 'Ingestion completed successfully' };
            }
            else {
                return { success: false, message: 'Ingestion failed' };
            }
        }
        catch (error) {
            console.error('Error during ingestion operation:', error);
            return { success: false, message: 'Ingestion failed due to an error' };
        }
    }
    async getIngestionStatus(id) {
        const ingestion = await this.IngestionRepository.findOne({ where: { id } });
        if (!ingestion) {
            throw new common_1.NotFoundException(`Ingestion with ID ${id} not found`);
        }
        return ingestion;
    }
    async cancelIngestion(id) {
        const ingestion = await this.IngestionRepository.findOne({ where: { id } });
        if (!ingestion) {
            throw new common_1.NotFoundException(`Ingestion with ID ${id} not found`);
        }
        ingestion.status = 'Cancelled';
        await this.IngestionRepository.save(ingestion);
        return { message: `Status changed to Cancel for id ${id}` };
    }
    async getAllIngestionProcesses() {
        try {
            const ingestion = await this.IngestionRepository.find();
            return ingestion;
        }
        catch (error) {
            console.error('Error fetching ingestion processes:', error);
            throw new Error('Could not fetch ingestion processes');
        }
    }
};
exports.IngestionService = IngestionService;
exports.IngestionService = IngestionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ingestion_entity_1.Ingestion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IngestionService);
//# sourceMappingURL=ingestion.service.js.map