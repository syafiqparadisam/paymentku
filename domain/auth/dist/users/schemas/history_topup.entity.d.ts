import { Users } from "./users.entity";
export declare class HistoryTopup {
    id: number;
    user: Users;
    amount: number;
    balance: number;
    status: string;
    previous_balance: number;
    isRead: boolean;
    created_at: Date;
}
