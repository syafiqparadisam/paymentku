import {
  Entity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Users } from './users.entity';
import { Status } from './enum';

@Entity()
export class HistoryTransfer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: string;

  @Column()
  sender_name: string;

  @ManyToOne(() => Users, (user) => user.history_transfer)
  user: Users;

  @Column()
  receiver: string;

  @Column()
  receiver_name: string;

  @Column({ type: 'bigint' })
  previous_balance: number;

  @Column({ type: 'bigint' })
  balance: number;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ unsigned: true })
  amount: number;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'text' })
  created_at: string;
}
