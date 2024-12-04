import { IngestionService } from './ingestion.service';
export declare class IngestionController {
    private readonly ingestionService;
    constructor(ingestionService: IngestionService);
    findAll(): Promise<import("./entities/ingestion.entity").Ingestion[]>;
    findOne(id: number): Promise<import("./entities/ingestion.entity").Ingestion>;
    cancel(id: number): Promise<void>;
}
