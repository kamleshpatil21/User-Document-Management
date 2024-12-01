import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { EntityManager } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingestion } from './entities/ingestion.entity';
import { Redis } from 'ioredis';
import axios from 'axios';

// Mocking external dependencies
jest.mock('axios');
jest.mock('ioredis');

describe('IngestionService (Unit Test)', () => {
  let service: IngestionService;
  let redis: Redis;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Ingestion),
          useValue: {
            create: jest.fn().mockReturnValue({}),
            save: jest.fn().mockResolvedValue({ id: 1, status: 'In Progress' }),
            findOne: jest.fn().mockResolvedValue({ id: 1, status: 'In Progress' }),
            find: jest.fn().mockResolvedValue([{ id: 1, status: 'In Progress' }]),
          },
        },
        {
          provide: EntityManager,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: Redis,
          useValue: {
            subscribe: jest.fn(),
            on: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    redis = module.get<Redis>(Redis);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should subscribe to Redis channel on module init', async () => {
    const subscribeSpy = jest.spyOn(redis, 'subscribe');
    await service.onModuleInit();
    expect(subscribeSpy).toHaveBeenCalledWith('ingestion_channel', expect.any(Function));
  });

  it('should process ingestion message', async () => {
    const message = JSON.stringify({ documentId: 1, userId: 1, metadata: {} });
    const processIngestionMessageSpy = jest.spyOn(service, 'processIngestionMessage');
    await service.onModuleInit(); // Trigger subscription
    redis.emit('message', 'ingestion_channel', message);
    expect(processIngestionMessageSpy).toHaveBeenCalledWith(message);
  });

  it('should trigger ingestion operation successfully', async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });
    const result = await service['triggerIngestionOperation']({
      documentId: 1,
      userId: 1,
      metadata: {},
    });
    expect(result.success).toBe(true);
    expect(axios.post).toHaveBeenCalledWith('http://python-service/ingest', expect.any(Object));
  });

  it('should trigger ingestion operation failure', async () => {
    axios.post.mockResolvedValueOnce({ status: 500 });
    const result = await service['triggerIngestionOperation']({
      documentId: 1,
      userId: 1,
      metadata: {},
    });
    expect(result.success).toBe(false);
  });

  it('should retrieve ingestion status', async () => {
    const findOneSpy = jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce({ id: 1, status: 'Completed' });
    const result = await service.getIngestionStatus(1);
    expect(findOneSpy).toHaveBeenCalledWith(Ingestion, { where: { id: 1 } });
    expect(result.status).toBe('Completed');
  });

  it('should throw error if ingestion status not found', async () => {
    const findOneSpy = jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(null);
    try {
      await service.getIngestionStatus(999); // Non-existent ID
    } catch (error) {
      expect(error.message).toBe('Ingestion not found');
    }
  });

  it('should cancel an ingestion', async () => {
    const findOneSpy = jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce({ id: 1, status: 'In Progress' });
    const saveSpy = jest.spyOn(entityManager, 'save').mockResolvedValueOnce({ id: 1, status: 'Cancelled' });
    await service.cancelIngestion(1);
    expect(saveSpy).toHaveBeenCalledWith({ id: 1, status: 'Cancelled' });
  });
});
