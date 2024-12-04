import { IngestionService } from './ingestion.service';
import { Ingestion } from './entities/ingestion.entity';
export declare class IngestionController {
    private readonly ingestionService;
    constructor(ingestionService: IngestionService);
    triggerIngestionOperation(data: any): Promise<any>;
    findAll(): Promise<Ingestion[]>;
    findOne(id: number): Promise<Ingestion>;
    cancel(id: number): Promise<{
        message: string;
    }>;
}
