import { EntityManager } from 'typeorm';
import { Ingestion } from './entities/ingestion.entity';
export declare class IngestionService {
    private readonly entityManager;
    constructor(entityManager: EntityManager);
    triggerIngestionOperation(data: any): Promise<any>;
    getIngestionStatus(id: number): Promise<Ingestion>;
    cancelIngestion(id: number): Promise<void>;
    getAllIngestionProcesses(): Promise<Ingestion[]>;
}
