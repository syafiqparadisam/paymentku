import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from  "typeorm";
import { Users } from './users.entity';
import { Status } from './enum';

@Entity()
export class HistoryTopup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (users) => users.history_topup)
  user: Users;

  @Column({ unsigned: true })
  amount: number;

  @Column({ type: 'bigint' })
  balance: number;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @Column({ type: 'bigint' })
  previous_balance: number;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'text' })
  created_at: string;
}
