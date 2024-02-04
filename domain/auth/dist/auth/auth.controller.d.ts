import { AuthService } from './auth.service';
import { loginRequest, registerRequest } from './dtos/request.js';
import { response } from '../interfaces/response';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: loginRequest, req: any, res: any): Promise<response>;
    auth(): Promise<void>;
    googleAuthCallback(req: any, res: any): Promise<any>;
    register(registerDto: registerRequest, res: any): Promise<response>;
    logout(req: any, res: any): Promise<response>;
    getNewAccessToken(req: any, res: any): Promise<response>;
    verifyUser(req: any): Promise<void>;
}
