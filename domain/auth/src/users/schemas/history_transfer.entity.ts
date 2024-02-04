import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";


@Entity()
export class HistoryTransfer {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Users, users => users.history_transfer_id)
    user: Users

    @Column()
    sender: string

    @Column()
    receiver: string

    @Column({ type: "bigint" })
    receiver_account: number

    @Column()
    status: string

    @Column({type: "text"})
    notes: string

    @Column()
    balance: string

    @Column()
    amount: number

    @Column({ default: false })
    isRead: boolean

    @Column({default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date
}