import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { HistoryTopup } from './history_topup.entity';
import { HistoryTransfer } from './history_transfer.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  email: string;

  @Column({ default: 0 })
  balance: number;

  @Column({ type: "bigint" })
  accountNumber: number;

  @Column()
  refreshToken_id: number;

  @OneToMany(() => HistoryTopup, history_topup => history_topup.user)
  history_topup_id: HistoryTopup[]

  @OneToMany(() => HistoryTransfer, history => history.user)
  history_transfer_id: HistoryTransfer[]

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile
}
