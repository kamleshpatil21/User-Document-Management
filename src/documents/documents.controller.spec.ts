import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocument = {
    id: 1,
    name: 'document.pdf',
    size: 1024,
    type: 'application/pdf',
    path: 'uploads/documents/document.pdf',
  };

  const mockService = {
    findAll: jest.fn().mockResolvedValue([mockDocument]),
    findOne: jest.fn().mockResolvedValue(mockDocument),
    create: jest.fn().mockResolvedValue(mockDocument),
    update: jest.fn().mockResolvedValue({ ...mockDocument, name: 'updated-document.pdf' }),
    remove: jest.fn().mockResolvedValue({ message: 'Document deleted successfully' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock JWT Auth Guard
      .compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of documents', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockDocument]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a document by ID', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockDocument);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a new document', async () => {
      const file = {
        originalname: 'document.pdf',
        size: 1024,
        mimetype: 'application/pdf',
        filename: 'document.pdf',
      } as Express.Multer.File;

      const createDocumentDto: CreateDocumentDto = {
        name: 'document.pdf',
        size: 1024,
        type: 'application/pdf',
        path: 'uploads/documents/document.pdf',
      };

      const result = await controller.create(file, createDocumentDto);
      expect(result).toEqual(mockDocument);
      expect(service.create).toHaveBeenCalledWith({
        ...createDocumentDto,
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        path: `uploads/documents/${file.filename}`,
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated document', async () => {
      const updateDto = { name: 'updated-document.pdf' };
      const result = await controller.update(1, updateDto);
      expect(result).toEqual({ ...mockDocument, name: 'updated-document.pdf' });
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a document and return a success message', async () => {
      const result = await controller.remove(1);
      expect(result).toEqual({ message: 'Document deleted successfully' });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
