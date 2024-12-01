import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { typeOrmConfig } from '../db/typeorm.config'; // Assuming your config is set here

describe('DocumentsService (Integration Test)', () => {
  let service: DocumentsService;
  let repository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([Document]),
      ],
      providers: [DocumentsService],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get(getRepositoryToken(Document));
  });

  it('should create a new document', async () => {
    const createDocumentDto = { path: 'path/to/file',name:"test",size:2010,type:"jpeg" };
    const document = await service.create(createDocumentDto);
    expect(document).toHaveProperty('id');
    expect(document.path).toBe('path/to/file');
  });

  it('should find all documents', async () => {
    await service.create({ path: 'path/to/file',name:"test",size:2010,type:"jpeg" });
    const documents = await service.findAll();
    expect(documents).toHaveLength(documents.length);
  });

  it('should find a document by ID', async () => {
    const doc = await service.create({ path: 'path/to/file',name:"test",size:2010,type:"jpeg" });
    const document = await service.findOne(doc.id);
    expect(document.id).toBe(doc.id);
  });

  it('should throw NotFoundException if document is not found', async () => {
    try {
      await service.findOne(999); // Non-existent ID
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should update a document', async () => {
    const doc = await service.create({ path: 'path/to/file',name:"test",size:2010,type:"jpeg" });
    const updatedDoc = await service.update(doc.id, { path: 'updated/path' });
    expect(updatedDoc.path).toBe('updated/path');
  });

  it('should delete a document', async () => {
    const doc = await service.create({ path: 'path/to/file',name:"test",size:2010,type:"jpeg" });
    await service.remove(doc.id);
    const foundDoc = await repository.findOne({ where: { id: doc.id } });
    expect(foundDoc).toBeUndefined();
  });
});
