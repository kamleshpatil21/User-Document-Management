import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    findAll(): Promise<import("./entities/document.entity").Document[]>;
    findOne(id: number): Promise<import("./entities/document.entity").Document>;
    create(file: Express.Multer.File, createDocumentDto: CreateDocumentDto): Promise<import("./entities/document.entity").Document>;
    update(id: number, updateDocumentDto: UpdateDocumentDto): Promise<import("./entities/document.entity").Document>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
