import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { registerRequest } from '../interfaces/request';
export declare class UsersService {
    private repository;
    constructor(repository: Repository<Users>);
    findByNumber(accNumber: number): Promise<Users[]>;
    createAccount(data: registerRequest): Promise<void>;
    findUser(user: string): Promise<Users>;
    findRefreshToken(token: string): Promise<Users>;
    comparePassword(passwordFromPayload: string, passFromFindData: string): Promise<boolean>;
    addRefreshToken(token: string, user: string): Promise<void>;
    deleteRefreshToken(user: string): Promise<void>;
}
