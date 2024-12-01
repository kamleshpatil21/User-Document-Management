import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Ingestion') // Grouping the endpoints under the 'Ingestion' tag in Swagger
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  /**
   * Get all ingestion processes
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all ingestion processes' }) // Operation summary
  @ApiResponse({
    status: 200,
    description: 'List of all ingestion processes retrieved successfully.',
  }) // Successful response
  @ApiResponse({ status: 401, description: 'Unauthorized' }) // Unauthorized response
  async findAll() {
    return this.ingestionService.getAllIngestionProcesses();
  }

  /**
   * Get a specific ingestion process status by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific ingestion process status' }) // Operation summary
  @ApiParam({ name: 'id', description: 'ID of the ingestion process' }) // Parameter description
  @ApiResponse({
    status: 200,
    description: 'Ingestion process status retrieved successfully.',
  }) // Successful response
  @ApiResponse({
    status: 404,
    description: 'Ingestion process not found.',
  }) // Not found response
  @ApiResponse({ status: 401, description: 'Unauthorized' }) // Unauthorized response
  async findOne(@Param('id') id: number) {
    return this.ingestionService.getIngestionStatus(id);
  }

  /**
   * Cancel a specific ingestion process by ID
   */
  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel a specific ingestion process' }) // Operation summary
  @ApiParam({ name: 'id', description: 'ID of the ingestion process to cancel' }) // Parameter description
  @ApiResponse({
    status: 200,
    description: 'Ingestion process canceled successfully.',
  }) // Successful response
  @ApiResponse({
    status: 404,
    description: 'Ingestion process not found.',
  }) // Not found response
  @ApiResponse({ status: 401, description: 'Unauthorized' }) // Unauthorized response
  async cancel(@Param('id') id: number) {
    return this.ingestionService.cancelIngestion(id);
  }
}
