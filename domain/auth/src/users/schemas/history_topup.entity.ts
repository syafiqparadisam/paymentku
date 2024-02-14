import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class HistoryTopup {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Users, users => users.history_topup_id)
    user: Users

    @Column({nullable: true})
    amount: number

    @Column({ type: "bigint", nullable: true })
    balance: number

    @Column({nullable: true})
    status: string

    @Column({ type: "bigint",nullable: true })
    previous_balance: number

    @Column({ default: false })
    isRead: boolean

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    created_at: Date
}