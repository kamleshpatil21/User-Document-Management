import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';  // Import the User entity

@Entity()
export class UserData {
  @PrimaryGeneratedColumn()
  id: number;  // Primary key for UserData entity

  @Column()
  name: string;  // The name field to store user data

  @Column()
  phoneNumber: string;  // Store phone number or any other data you need

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })  // Foreign Key referencing the User table
  user: User;  // Establish the relationship with the User entity
  
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;  // Creation timestamp for UserData
}
