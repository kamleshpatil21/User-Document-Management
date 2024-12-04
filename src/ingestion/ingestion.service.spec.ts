import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { IngestionService } from './ingestion.service';
import { Ingestion } from './entities/ingestion.entity';
import axios from 'axios';

jest.mock('axios');

describe('IngestionService', () => {
  let service: IngestionService;
  let entityManagerMock: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    entityManagerMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        { provide: EntityManager, useValue: entityManagerMock },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('triggerIngestionOperation', () => {
    it('should log and return success when API call succeeds', async () => {
      const mockData = { documentId: '123', userId: '456', metadata: {} };
      (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

      const result = await service.triggerIngestionOperation(mockData);

      expect(console.log).toHaveBeenCalledWith('Triggering ingestion operation for document ID:', '123');
      expect(axios.post).toHaveBeenCalledWith('http://python-service/ingest', mockData);
      expect(result).toEqual({ success: true, message: 'Ingestion completed successfully' });
    });

    it('should return failure when API call fails', async () => {
      const mockData = { documentId: '123', userId: '456', metadata: {} };
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await service.triggerIngestionOperation(mockData);

      expect(console.error).toHaveBeenCalledWith('Error during ingestion operation:', expect.any(Error));
      expect(result).toEqual({ success: false, message: 'Ingestion failed due to an error' });
    });
  });

  describe('getIngestionStatus', () => {
    it('should return the ingestion process if found', async () => {
      const mockIngestion = { id: 1, status: 'Completed' } as Ingestion;
      entityManagerMock.findOne.mockResolvedValueOnce(mockIngestion);

      const result = await service.getIngestionStatus(1);

      expect(entityManagerMock.findOne).toHaveBeenCalledWith(Ingestion, { where: { id: 1 } });
      expect(result).toEqual(mockIngestion);
    });

    it('should throw an error if ingestion process is not found', async () => {
      entityManagerMock.findOne.mockResolvedValueOnce(null);

      await expect(service.getIngestionStatus(1)).rejects.toThrow('Ingestion not found');
    });
  });

  describe('cancelIngestion', () => {
    it('should mark the ingestion as cancelled', async () => {
      const mockIngestion = { id: 1, status: 'In Progress' } as Ingestion;
      entityManagerMock.findOne.mockResolvedValueOnce(mockIngestion);

      await service.cancelIngestion(1);

      expect(entityManagerMock.findOne).toHaveBeenCalledWith(Ingestion, { where: { id: 1 } });
      expect(mockIngestion.status).toBe('Cancelled');
      expect(entityManagerMock.save).toHaveBeenCalledWith(mockIngestion);
    });

    it('should throw an error if ingestion process is not found', async () => {
      entityManagerMock.findOne.mockResolvedValueOnce(null);

      await expect(service.cancelIngestion(1)).rejects.toThrow('Ingestion not found');
    });
  });

  describe('getAllIngestionProcesses', () => {
    it('should return all ingestion processes', async () => {
      const mockIngestions = [
        { id: 1, status: 'Completed' },
        { id: 2, status: 'In Progress' },
      ] as Ingestion[];
      entityManagerMock.find.mockResolvedValueOnce(mockIngestions);

      const result = await service.getAllIngestionProcesses();

      expect(entityManagerMock.find).toHaveBeenCalledWith(Ingestion);
      expect(result).toEqual(mockIngestions);
    });

    it('should throw an error if fetching processes fails', async () => {
      entityManagerMock.find.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.getAllIngestionProcesses()).rejects.toThrow('Could not fetch ingestion processes');
      expect(console.error).toHaveBeenCalledWith('Error fetching ingestion processes:', expect.any(Error));
    });
  });
});
