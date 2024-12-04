import { Injectable, NotFoundException } from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { DocumentsService } from './documents.service';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  unlinkSync: jest.fn(),
}));

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repository: Repository<Document>;

  const mockDocumentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a document with all properties', async () => {
      const createDocumentDto: CreateDocumentDto = {
        name: 'document.pdf',
        size: 1024,
        type: 'application/pdf',
        path: 'uploads/documents/document.pdf',
      };
      const mockDocument = { id: 1, ...createDocumentDto };

      mockDocumentRepository.create.mockReturnValue(mockDocument);
      mockDocumentRepository.save.mockResolvedValue(mockDocument);

      const result = await service.create(createDocumentDto);

      expect(mockDocumentRepository.create).toHaveBeenCalledWith(createDocumentDto);
      expect(mockDocumentRepository.save).toHaveBeenCalledWith(mockDocument);
      expect(result).toEqual(mockDocument);
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      const mockDocuments = [
        { id: 1, name: 'document1.pdf', size: 2048, type: 'application/pdf', path: 'path1' },
        { id: 2, name: 'document2.pdf', size: 4096, type: 'application/pdf', path: 'path2' },
      ];

      mockDocumentRepository.find.mockResolvedValue(mockDocuments);

      const result = await service.findAll();

      expect(mockDocumentRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockDocuments);
    });
  });

  describe('findOne', () => {
    it('should return a document if found', async () => {
      const mockDocument = { id: 1, name: 'document.pdf', size: 1024, type: 'application/pdf', path: 'path/to/doc' };

      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);

      const result = await service.findOne(1);

      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if document not found', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a document if found', async () => {
      const mockDocument = {
        id: 1,
        name: 'old-document.pdf',
        size: 512,
        type: 'application/pdf',
        path: '/path/old',
      };
      const updateDocumentDto: UpdateDocumentDto = { name: 'new-document.pdf', size: 1024 };

      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);
      mockDocumentRepository.save.mockResolvedValue({ ...mockDocument, ...updateDocumentDto });

      const result = await service.update(1, updateDocumentDto);

      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockDocumentRepository.save).toHaveBeenCalledWith({ ...mockDocument, ...updateDocumentDto });
      expect(result).toEqual({ ...mockDocument, ...updateDocumentDto });
    });

    it('should throw NotFoundException if document not found', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(undefined);
      const updateDocumentDto: UpdateDocumentDto = { name: 'new-document.pdf', size: 1024 };

      await expect(service.update(1, updateDocumentDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a document and remove its file', async () => {
      const mockDocument = { id: 1, path: 'uploads/documents/document.pdf' };

      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);
      mockDocumentRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(unlinkSync).toHaveBeenCalledWith(join(__dirname, '..', '..', mockDocument.path));
      expect(mockDocumentRepository.remove).toHaveBeenCalledWith(mockDocument);
    });

    it('should throw NotFoundException if document not found', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(undefined);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
