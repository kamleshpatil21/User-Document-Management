import { Controller, Post, Body, Get, Param, Put, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Ingestion') // Grouping the endpoints under the 'Ingestion' tag in Swagger
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger-operation')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Trigger an ingestion operation' })
  @ApiBody({
    description: 'Data required to trigger an ingestion operation',
    schema: {
      type: 'object',
      properties: {
        documentId: { type: 'string', example: '12345' },
        userId: { type: 'string', example: '67890' },
        metadata: {
          type: 'object',
          example: { key1: 'value1', key2: 'value2' },
        },
      },
      required: ['documentId', 'userId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Ingestion operation triggered successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Ingestion completed successfully' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Ingestion operation failed',
  })
  async triggerIngestionOperation(@Body() data: any): Promise<any> {
    try {
      // Call the service method and return the result
      const result = await this.ingestionService.triggerIngestionOperation(data);
      return result;
    } catch (error) {
      console.error('Error triggering ingestion operation:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to trigger ingestion operation',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Get all ingestion processes
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
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
