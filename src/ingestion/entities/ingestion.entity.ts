import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ingestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentId: number;

  @Column({ default: 'Pending' })
  status: string;


  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;
}
