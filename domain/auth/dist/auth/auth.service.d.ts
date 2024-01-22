import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { loginRequest, registerRequest } from 'src/interfaces/request';
import { response } from 'src/interfaces/response';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    signIn(payload: loginRequest): Promise<response>;
    createAccount(data: registerRequest): Promise<response>;
    getNewRefreshToken(cookie: any): Promise<response>;
    logout(cookie: any): Promise<response>;
}
