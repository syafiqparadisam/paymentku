import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({default: 0})
  balance: number;

  @Column({type: "bigint"})
  accountNumber: number;

  @Column({ nullable: true })
  refreshToken: string;
}
