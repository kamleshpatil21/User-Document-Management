import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { join } from 'path';

jest.mock('fs');
jest.mock('path');

describe('DocumentsService (Unit Test)', () => {
  let service: DocumentsService;
  let repository: Repository<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: {
            create: jest.fn().mockReturnValue({}),
            save: jest.fn().mockResolvedValue({ id: 1, path: 'path/to/file' }),
            find: jest.fn().mockResolvedValue([{ id: 1, path: 'path/to/file' }]),
            findOne: jest.fn().mockResolvedValue({ id: 1, path: 'path/to/file' }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new document', async () => {
    const createDocumentDto = { path: 'path/to/file',name:"test",size:2010,type:"jpeg" };
    const document = await service.create(createDocumentDto);
    expect(document).toEqual({ id: 1, path: 'path/to/file' });
    expect(repository.save).toHaveBeenCalledWith(createDocumentDto);
  });

  it('should find all documents', async () => {
    const documents = await service.findAll();
    expect(documents).toEqual([{ id: 1, path: 'path/to/file' }]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should find a document by ID', async () => {
    const document = await service.findOne(1);
    expect(document).toEqual({ id: 1, path: 'path/to/file' });
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw NotFoundException if document is not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
    try {
      await service.findOne(1);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Document with ID 1 not found');
    }
  });

  it('should update a document', async () => {
    const updateDocumentDto = { path: 'updated/path' };
    const updatedDocument = await service.update(1, updateDocumentDto);
    expect(updatedDocument).toEqual({ id: 1, path: 'updated/path' });
    expect(repository.save).toHaveBeenCalledWith({ id: 1, path: 'updated/path' });
  });

  it('should delete a document', async () => {
    const documentToDelete ={ id:1,path: 'path/to/file',name:"test",size:2010,type:"jpeg" };
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(documentToDelete);
    await service.remove(1);
    expect(unlinkSync).toHaveBeenCalledWith(join(__dirname, '..', '..', documentToDelete.path));
    expect(repository.remove).toHaveBeenCalledWith(documentToDelete);
  });
});
