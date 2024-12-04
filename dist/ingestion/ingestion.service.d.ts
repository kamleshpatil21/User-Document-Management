import { OnModuleInit } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Ingestion } from './entities/ingestion.entity';
export declare class IngestionService implements OnModuleInit {
    private readonly entityManager;
    private readonly redis;
    constructor(entityManager: EntityManager);
    onModuleInit(): Promise<void>;
    processIngestionMessage(message: string): Promise<void>;
    private triggerIngestionOperation;
    getIngestionStatus(id: number): Promise<Ingestion>;
    cancelIngestion(id: number): Promise<void>;
    getAllIngestionProcesses(): Promise<Ingestion[]>;
}
