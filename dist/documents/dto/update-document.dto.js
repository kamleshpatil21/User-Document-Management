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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UpdateDocumentDto {
}
exports.UpdateDocumentDto = UpdateDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the document',
        example: 'updated-document.pdf',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The size of the document in bytes',
        example: 2048,
        required: false,
    }),
    __metadata("design:type", Number)
], UpdateDocumentDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The MIME type of the document',
        example: 'application/pdf',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The file path where the document is stored',
        example: 'uploads/documents/updated-document.pdf',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "path", void 0);
//# sourceMappingURL=update-document.dto.js.map