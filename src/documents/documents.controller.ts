import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseInterceptors,
    UploadedFile,
    UseGuards,
  } from '@nestjs/common';
  import { DocumentsService } from './documents.service';
  import { CreateDocumentDto } from './dto/create-document.dto';
  import { UpdateDocumentDto } from './dto/update-document.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import * as path from 'path';
  import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
  
  @ApiTags('Documents') // Swagger Grouping Tag
  @Controller('documents')
  export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}
  

    /**
     * Get all documents
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOperation({ summary: 'Retrieve all documents' }) // Operation description
    @ApiResponse({ status: 200, description: 'List of documents retrieved successfully.' }) // Successful response
    @ApiResponse({ status: 401, description: 'Unauthorized' }) // Unauthorized response
    async findAll() {
      return this.documentsService.findAll();
    }
  
    /**
     * Get a document by ID
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a document by its ID' }) // Operation description
    @ApiResponse({ status: 200, description: 'Document retrieved successfully.' }) // Successful response
    @ApiResponse({ status: 404, description: 'Document not found' }) // Not found response
    @ApiResponse({ status: 401, description: 'Unauthorized' }) // Unauthorized response
    async findOne(@Param('id') id: number) {
      return this.documentsService.findOne(id);
    }
  
    /**
     * Create a document (upload)
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/documents', // Configure the storage path
          filename: (req, file, cb) => {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
          },
        }),
      }),
    )
    @ApiOperation({ summary: 'Upload a document' }) // Operation description
    @ApiBody({ type: CreateDocumentDto }) // Request body type
    @ApiResponse({ status: 201, description: 'Document created successfully.' }) // Successful response
    @ApiResponse({ status: 400, description: 'Bad request' }) // Bad request response
    @ApiResponse({ status: 401, description: 'Unauthorized' }) // Unauthorized response
    async create(
      @UploadedFile() file: Express.Multer.File,
      @Body() createDocumentDto: CreateDocumentDto,
    ) {
      const document = await this.documentsService.create({
        ...createDocumentDto,
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        path: `uploads/documents/${file.filename}`,
      });
      return document;
    }
  
    /**
     * Update a document
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put(':id')
    @ApiOperation({ summary: 'Update a document by its ID' }) // Operation description
    @ApiBody({ type: UpdateDocumentDto }) // Request body type
    @ApiResponse({ status: 200, description: 'Document updated successfully.' }) // Successful response
    @ApiResponse({ status: 404, description: 'Document not found' }) // Not found response
    @ApiResponse({ status: 401, description: 'Unauthorized' }) // Unauthorized response
    async update(
      @Param('id') id: number,
      @Body() updateDocumentDto: UpdateDocumentDto,
    ) {
      return this.documentsService.update(id, updateDocumentDto);
    }
  
    /**
     * Delete a document
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a document by its ID' }) // Operation description
    @ApiResponse({ status: 200, description: 'Document deleted successfully.' }) // Successful response
    @ApiResponse({ status: 404, description: 'Document not found' }) // Not found response
    @ApiResponse({ status: 401, description: 'Unauthorized' }) // Unauthorized response
    async remove(@Param('id') id: number) {
      return this.documentsService.remove(id);
    }
  }
  