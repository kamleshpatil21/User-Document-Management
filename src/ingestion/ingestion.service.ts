import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Ingestion } from './entities/ingestion.entity'; 
import axios from 'axios'; 

@Injectable()
export class IngestionService implements OnModuleInit {
    private readonly redis: Redis;
  constructor(
    
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {
    this.redis = new Redis({
        host: 'localhost', 
        port: 6379,        
      });
  }

  async onModuleInit() {
    // Subscribe to Redis channel for ingestion messages
    this.redis.subscribe('ingestion_channel', (err, count) => {
      if (err) {
        console.error('Failed to subscribe to channel:', err);
        return;
      }
      console.log(`Subscribed to ${count} channel(s).`);
    });

    // Listen to messages from Redis channel
    this.redis.on('message', async (channel, message) => {
      if (channel === 'ingestion_channel') {
        console.log('Received message:', message);
        // Process the message for ingestion
        await this.processIngestionMessage(message);
      }
    });
  }

  // Process the message for ingestion (trigger the ingestion logic)
   async processIngestionMessage(message: string) {
    try {
      // Step 1: Parse the message
      const data = JSON.parse(message);
      const { documentId, userId, metadata } = data;

      // Step 2: Log received data for debugging
      console.log(`Processing ingestion for Document ID: ${documentId}, User ID: ${userId}`);

      // Step 3: Create a new ingestion record in the database with status 'In Progress'
      const ingestion = this.entityManager.create(Ingestion, {
        documentId,
        userId,
        metadata,
        status: 'In Progress', // Mark as 'In Progress'
      });
      await this.entityManager.save(ingestion); // Save to database

      // Step 4: Perform the actual ingestion logic (e.g., file processing, calling an API, etc.)
      const ingestionResult = await this.triggerIngestionOperation(data);

      // Step 5: Update the ingestion status based on the result (e.g., 'Completed' or 'Failed')
      ingestion.status = ingestionResult.success ? 'Completed' : 'Failed';
      await this.entityManager.save(ingestion); // Save the final status

      console.log('Ingestion process completed:', ingestionResult);
    } catch (error) {
      console.error('Error processing ingestion message:', error);
      
    }
  }

  // Example function that triggers an external ingestion operation
  private async triggerIngestionOperation(data: any): Promise<any> {
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
