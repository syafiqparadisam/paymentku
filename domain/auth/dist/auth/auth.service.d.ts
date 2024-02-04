import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { loginRequest, loginWithGoogle, registerRequest } from './dtos/request';
import { response } from '../interfaces/response';
import { UsersService } from '../users/users.service';
import { jwtPayload } from 'src/interfaces/jwtPayload';
import { RefreshTokenService } from 'src/refreshToken/refreshToken.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private rTokenService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, rTokenService: RefreshTokenService, configService: ConfigService);
    generateJWT(payload: jwtPayload): Promise<string>;
    signInWithGoogle(payload: loginWithGoogle): Promise<response>;
    signIn(payload: loginRequest, cookies: any): Promise<response>;
    createAccount(data: registerRequest): Promise<response>;
    getNewAccessToken(cookie: any): Promise<response>;
    logout(cookie: any): Promise<response>;
}
