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
exports.IngestionController = void 0;
const common_1 = require("@nestjs/common");
const ingestion_service_1 = require("./ingestion.service");
const swagger_1 = require("@nestjs/swagger");
let IngestionController = class IngestionController {
    constructor(ingestionService) {
        this.ingestionService = ingestionService;
    }
    async findAll() {
        return this.ingestionService.getAllIngestionProcesses();
    }
    async findOne(id) {
        return this.ingestionService.getIngestionStatus(id);
    }
    async cancel(id) {
        return this.ingestionService.cancelIngestion(id);
    }
};
exports.IngestionController = IngestionController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all ingestion processes' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all ingestion processes retrieved successfully.',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IngestionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a specific ingestion process status' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID of the ingestion process' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ingestion process status retrieved successfully.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ingestion process not found.',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IngestionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a specific ingestion process' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID of the ingestion process to cancel' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ingestion process canceled successfully.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Ingestion process not found.',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IngestionController.prototype, "cancel", null);
exports.IngestionController = IngestionController = __decorate([
    (0, swagger_1.ApiTags)('Ingestion'),
    (0, common_1.Controller)('ingestion'),
    __metadata("design:paramtypes", [ingestion_service_1.IngestionService])
], IngestionController);
//# sourceMappingURL=ingestion.controller.js.map