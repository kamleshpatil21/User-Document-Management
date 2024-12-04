import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockIngestionService = {
    triggerIngestionOperation: jest.fn(),
    getAllIngestionProcesses: jest.fn(),
    getIngestionStatus: jest.fn(),
    cancelIngestion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock JwtAuthGuard
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock RolesGuard
      .compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('triggerIngestionOperation', () => {
    it('should handle errors when triggering ingestion operation', async () => {
      const mockData = { documentId: '12345', userId: '67890' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      mockIngestionService.triggerIngestionOperation.mockRejectedValue(new Error('Internal Error'));
  
      await expect(controller.triggerIngestionOperation(mockData)).rejects.toThrow(
        new HttpException(
          { success: false, message: 'Failed to trigger ingestion operation' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
  
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error triggering ingestion operation:',
        expect.any(Error),
      );
  
      consoleErrorSpy.mockRestore(); // Restore console.error after the test
    });
  });
  

  describe('findAll', () => {
    it('should retrieve all ingestion processes', async () => {
      const mockProcesses = [{ id: 1, status: 'Completed' }, { id: 2, status: 'Pending' }];

      mockIngestionService.getAllIngestionProcesses.mockResolvedValue(mockProcesses);

      const result = await controller.findAll();
      expect(result).toEqual(mockProcesses);
      expect(service.getAllIngestionProcesses).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should retrieve a specific ingestion process status', async () => {
      const mockId = 1;
      const mockStatus = { id: 1, status: 'Completed' };

      mockIngestionService.getIngestionStatus.mockResolvedValue(mockStatus);

      const result = await controller.findOne(mockId);
      expect(result).toEqual(mockStatus);
      expect(service.getIngestionStatus).toHaveBeenCalledWith(mockId);
    });

    it('should handle ingestion process not found', async () => {
      const mockId = 1;

      mockIngestionService.getIngestionStatus.mockResolvedValue(null);

      const result = await controller.findOne(mockId);
      expect(result).toBeNull();
      expect(service.getIngestionStatus).toHaveBeenCalledWith(mockId);
    });
  });

  describe('cancel', () => {
    it('should cancel a specific ingestion process', async () => {
      const mockId = 1;
      const mockResponse = { success: true, message: 'Ingestion process canceled successfully' };

      mockIngestionService.cancelIngestion.mockResolvedValue(mockResponse);

      const result = await controller.cancel(mockId);
      expect(result).toEqual(mockResponse);
      expect(service.cancelIngestion).toHaveBeenCalledWith(mockId);
    });
  });
});
