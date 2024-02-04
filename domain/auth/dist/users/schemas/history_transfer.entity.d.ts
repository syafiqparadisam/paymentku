import { Users } from "./users.entity";
export declare class HistoryTransfer {
    id: number;
    user: Users;
    sender: string;
    receiver: string;
    receiver_account: number;
    status: string;
    notes: string;
    balance: string;
    amount: number;
    isRead: boolean;
    createdAt: Date;
}
