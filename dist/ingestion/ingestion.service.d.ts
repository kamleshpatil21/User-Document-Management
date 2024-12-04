import { Repository } from 'typeorm';
import { Ingestion } from './entities/ingestion.entity';
export declare class IngestionService {
    private readonly IngestionRepository;
    constructor(IngestionRepository: Repository<Ingestion>);
    triggerIngestionOperation(data: any): Promise<any>;
    getIngestionStatus(id: number): Promise<Ingestion>;
    cancelIngestion(id: number): Promise<{
        message: string;
    }>;
    getAllIngestionProcesses(): Promise<Ingestion[]>;
}
