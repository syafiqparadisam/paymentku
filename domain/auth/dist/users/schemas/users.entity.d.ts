import { Profile } from './profile.entity';
import { HistoryTopup } from './history_topup.entity';
import { HistoryTransfer } from './history_transfer.entity';
export declare class Users {
    id: number;
    user: string;
    password: string;
    email: string;
    balance: number;
    accountNumber: number;
    refreshToken_id: number;
    history_topup_id: HistoryTopup[];
    history_transfer_id: HistoryTransfer[];
    profile: Profile;
}
