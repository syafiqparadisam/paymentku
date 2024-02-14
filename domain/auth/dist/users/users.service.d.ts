import { Users } from './schemas/users.entity';
import { Repository } from 'typeorm';
import { loginWithGoogle, registerRequest } from '../auth/dtos/request';
import { Profile } from './schemas/profile.entity';
import { RefreshTokenService } from 'src/refreshToken/refreshToken.service';
import { result } from 'src/interfaces/result';
import { HistoryTopup } from './schemas/history_topup.entity';
import { HistoryTransfer } from './schemas/history_transfer.entity';
export declare class UsersService {
    private userRepo;
    private profileRepo;
    private historyTopUpRepo;
    private historyTransferRepo;
    private mongorToken;
    constructor(userRepo: Repository<Users>, profileRepo: Repository<Profile>, historyTopUpRepo: Repository<HistoryTopup>, historyTransferRepo: Repository<HistoryTransfer>, mongorToken: RefreshTokenService);
    generateAccountNumber(): number;
    findAccNumber(accNumber: number): Promise<Users[]>;
    createAccountNumber(): Promise<number>;
    createAccount(data: registerRequest): Promise<result>;
    findUserById(id: number): Promise<Users>;
    findUserByEmail(email: string): Promise<Users>;
    findUserByUsername(user: string): Promise<Users>;
    findUserByRefreshTokenId(token_id: string): Promise<Users>;
    updateName(profileId: number, name: any): Promise<result>;
    joiningUserAndProfile(userId: number): Promise<result>;
    updatePhotoProfile(profileId: number, photo_profile: string): Promise<result>;
    createAccountWithGoogle(user: loginWithGoogle): Promise<result>;
    comparePassword(passwordFromPayload: string, passFromFindData: string): Promise<boolean>;
}
