import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
export declare class DocumentsService {
    private documentsRepository;
    constructor(documentsRepository: Repository<Document>);
    create(createDocumentDto: CreateDocumentDto): Promise<Document>;
    findAll(): Promise<Document[]>;
    findOne(id: number): Promise<Document>;
    update(id: number, updateDocumentDto: UpdateDocumentDto): Promise<Document>;
    remove(id: number): Promise<void>;
}
