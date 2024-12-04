import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingestion } from './entities/ingestion.entity';
import { NotFoundException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios'); // Mock axios

describe('IngestionService', () => {
  let service: IngestionService;
  let repository: Repository<Ingestion>;

  const mockIngestionRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockIngestion = {
    id: 1,
    documentId: '12345',
    userId: '67890',
    metadata: { key1: 'value1' },
    status: 'Pending',
  };
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Ingestion),
          useValue: mockIngestionRepository,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    repository = module.get<Repository<Ingestion>>(getRepositoryToken(Ingestion));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('triggerIngestionOperation', () => {
    it('should save ingestion data and call an external API successfully', async () => {
      const axiosResponse = { status: 200 };
      (axios.post as jest.Mock).mockResolvedValueOnce(axiosResponse);

      mockIngestionRepository.save.mockResolvedValue(mockIngestion);

      const result = await service.triggerIngestionOperation({
        documentId: '12345',
        userId: '67890',
        metadata: { key1: 'value1' },
      });

      expect(mockIngestionRepository.save).toHaveBeenCalledWith({
        documentId: '12345',
        userId: '67890',
        metadata: { key1: 'value1' },
      });
      expect(axios.post).toHaveBeenCalledWith('http://python-service/ingest', {
        documentId: '12345',
        userId: '67890',
        metadata: { key1: 'value1' },
      });
      expect(result).toEqual({ success: true, message: 'Ingestion completed successfully' });
    });

    it('should handle errors during the ingestion operation', async () => {
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      const result = await service.triggerIngestionOperation({
        documentId: '12345',
        userId: '67890',
        metadata: { key1: 'value1' },
      });

      expect(result).toEqual({ success: false, message: 'Ingestion failed due to an error' });
    });
  });

  describe('getIngestionStatus', () => {
    it('should return the ingestion status for a valid ID', async () => {
      mockIngestionRepository.findOne.mockResolvedValue(mockIngestion);

      const result = await service.getIngestionStatus(1);

      expect(mockIngestionRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockIngestion);
    });

    it('should throw NotFoundException for an invalid ID', async () => {
      mockIngestionRepository.findOne.mockResolvedValue(null);

      await expect(service.getIngestionStatus(999)).rejects.toThrow(
        new NotFoundException('Ingestion with ID 999 not found'),
      );
    });
  });

  describe('cancelIngestion', () => {
    it('should cancel the ingestion process for a valid ID', async () => {
      const updatedIngestion = { ...mockIngestion, status: 'Cancelled' };
      mockIngestionRepository.findOne.mockResolvedValue(mockIngestion);
      mockIngestionRepository.save.mockResolvedValue(updatedIngestion);

      const result = await service.cancelIngestion(1);

      expect(mockIngestionRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockIngestionRepository.save).toHaveBeenCalledWith(updatedIngestion);
      expect(result).toEqual({ message: 'Status changed to Cancel for id 1' });
    });

    it('should throw NotFoundException for an invalid ID', async () => {
      mockIngestionRepository.findOne.mockResolvedValue(null);

      await expect(service.cancelIngestion(999)).rejects.toThrow(
        new NotFoundException('Ingestion with ID 999 not found'),
      );
    });
  });

  describe('getAllIngestionProcesses', () => {
    it('should return all ingestion processes', async () => {
      mockIngestionRepository.find.mockResolvedValue([mockIngestion]);

      const result = await service.getAllIngestionProcesses();

      expect(mockIngestionRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockIngestion]);
    });

    it('should handle errors during fetching ingestion processes', async () => {
      mockIngestionRepository.find.mockRejectedValue(new Error('DB error'));

      await expect(service.getAllIngestionProcesses()).rejects.toThrow(
        'Could not fetch ingestion processes',
      );
    });
  });
});
