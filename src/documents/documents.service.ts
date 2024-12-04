import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  // Create a new document
  async   create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const document = this.documentsRepository.create(createDocumentDto);
    return this.documentsRepository.save(document);
  }

  // Find all documents
  async findAll(): Promise<Document[]> {
    return this.documentsRepository.find();
  }

  // Find a document by ID
  async findOne(id: number): Promise<Document> {
    const document = await this.documentsRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  // Update a document
  async update(id: number, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const document = await this.findOne(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    Object.assign(document, updateDocumentDto);
    return this.documentsRepository.save(document);
  }

  // Delete a document
  async remove(id: number) {
    const document = await this.findOne(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    // Optionally, remove the file from the filesystem if required
    unlinkSync(join(__dirname, '..', '..', document.path)); // Example: Delete the file from disk
    await this.documentsRepository.remove(document);
    return {message:`Document with ID ${id} Delete`};
  }
}
