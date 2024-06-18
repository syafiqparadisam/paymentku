import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { HistoryTopup } from './history_topup.entity';
import { HistoryTransfer } from './history_transfer.entity';
import { Notification } from './notification.entity';

@Entity()
export class Users{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  user: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'bigint' })
  balance: number;

  @Column({ type: 'bigint', unsigned: true, unique: true })
  accountNumber: number;

  @OneToMany(() => HistoryTopup, (history_topup) => history_topup.user, {
    cascade: true,
  })
  history_topup: HistoryTopup[];

  @OneToOne(() => Profile, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => HistoryTransfer, (history) => history.user, {
    cascade: true,
  })
  history_transfer: HistoryTransfer[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  notification: Notification[];

  @Column({ type: 'text' })
  created_at: string;
}
