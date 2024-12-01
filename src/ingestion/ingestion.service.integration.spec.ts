import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingestion } from './entities/ingestion.entity';
import { Redis } from 'ioredis';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { typeOrmConfig } from 'src/db/typeorm.config';
import { HttpModule } from '@nestjs/axios';

jest.mock('axios');

describe('IngestionService (Integration Test)', () => {
  let service: IngestionService;
  let redis: Redis;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([Ingestion]),
        HttpModule
      ],
      providers: [IngestionService],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    redis = module.get<Redis>(Redis);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should create an ingestion and mark as In Progress', async () => {
    const createData = {
      documentId: 1,
      userId: 1,
      metadata: {},
    };

    const ingestion = await service.processIngestionMessage(createData);
    expect(ingestion.status).toBe('In Progress');
  });

  it('should update ingestion status to Completed', async () => {
    // Mock axios.post
    axios.post.mockResolvedValueOnce({ status: 200 });

    const createData = {
      documentId: 1,
      userId: 1,
      metadata: {},
    };

    const ingestion = await service.processIngestionMessage(createData);
    expect(ingestion.status).toBe('Completed');
  });

  it('should update ingestion status to Failed on error', async () => {
    // Mock axios.post to return an error
    axios.post.mockResolvedValueOnce({ status: 500 });

    const createData = {
      documentId: 1,
      userId: 1,
      metadata: {},
    };

    const ingestion = await service.processIngestionMessage(createData);
    expect(ingestion.status).toBe('Failed');
  });

  it('should retrieve all ingestion processes', async () => {
    const createData = {
      documentId: 1,
      userId: 1,
      metadata: {},
    };

    // First, create an ingestion record
    await service.processIngestionMessage(createData);

    // Retrieve all ingestion processes
    const ingestionProcesses = await service.getAllIngestionProcesses();
    expect(ingestionProcesses.length).toBeGreaterThan(0);
  });
});
