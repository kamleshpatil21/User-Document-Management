import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Ingestion } from './entities/ingestion.entity'; 
import axios from 'axios'; 

@Injectable()
export class IngestionService  {
  
      constructor(
    
        @InjectEntityManager() private readonly entityManager: EntityManager
      ) {}
    
     
 async triggerIngestionOperation(data: any): Promise<any> {
    try {
      // This can be any custom logic to trigger ingestion, e.g., API call, file processing, etc.
      console.log('Triggering ingestion operation for document ID:', data.documentId);

      // Example: Make an API call to a Python service or some other ingestion service
      const response = await axios.post('http://python-service/ingest', {
        documentId: data.documentId,
        userId: data.userId,
        metadata: data.metadata,
      });

      // Simulate successful ingestion response
      if (response.status === 200) {
        return { success: true, message: 'Ingestion completed successfully' };
      } else {
        return { success: false, message: 'Ingestion failed' };
      }
    } catch (error) {
      console.error('Error during ingestion operation:', error);
      return { success: false, message: 'Ingestion failed due to an error' };
    }
  }

  // Method to retrieve the status of an ingestion process
  async getIngestionStatus(id: number) {
    const ingestion = await this.entityManager.findOne(Ingestion, { where: { id } });
    if (!ingestion) {
      throw new Error('Ingestion not found');
    }
    return ingestion;
  }

  // Method to cancel an ingestion process (if needed)
  async cancelIngestion(id: number) {
    const ingestion = await this.entityManager.findOne(Ingestion, { where: { id } });
    if (!ingestion) {
      throw new Error('Ingestion not found');
    }

    // Mark as cancelled
    ingestion.status = 'Cancelled';
    await this.entityManager.save(ingestion);
  }
  async getAllIngestionProcesses() {
    try {
      const ingestion = await this.entityManager.find(Ingestion); // Fetch all ingestion processes
      return ingestion;
    } catch (error) {
      console.error('Error fetching ingestion processes:', error);
      throw new Error('Could not fetch ingestion processes');
    }
  }
}
