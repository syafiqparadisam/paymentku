import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  icon: string;

  @Column({ default: false })
  isRead: boolean;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  created_at: string;

  @Column()
  type: string;

  @ManyToOne(() => Users, (user) => user.notification)
  user: Users;
}
