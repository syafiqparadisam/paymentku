import { Users } from './schemas/users.entity';
import { Repository } from 'typeorm';
import { loginWithGoogle, registerRequest } from '../auth/dtos/request';
export declare class UsersService {
    private repository;
    constructor(repository: Repository<Users>);
    findByNumber(accNumber: number): Promise<Users[]>;
    createAccount(data: registerRequest): Promise<{
        success: boolean;
        error?: any;
    }>;
    findUserById(id: number): Promise<Users>;
    findUserByEmail(email: string): Promise<Users>;
    findUserByUsername(user: string): Promise<Users>;
    createAccountWithGoogle(user: loginWithGoogle): Promise<{
        success: boolean;
    }>;
    comparePassword(passwordFromPayload: string, passFromFindData: string): Promise<boolean>;
}
