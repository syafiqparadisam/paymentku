import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";


@Entity()
export class HistoryTransfer {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Users, users => users.history_transfer_id)
    user: Users

    @Column({ nullable: true })
    sender: string

    @Column({ nullable: true })
    receiver: string

    @Column({ type: "bigint", nullable: true })
    receiver_account: number

    @Column({ nullable: true })
    status: string

    @Column({ type: "text", nullable: true })
    notes: string

    @Column({ nullable: true })
    balance: string

    @Column({ nullable: true })
    amount: number

    @Column({ default: false })
    isRead: boolean

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date
}