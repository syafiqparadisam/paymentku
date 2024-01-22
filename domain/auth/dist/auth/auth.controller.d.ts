import { AuthService } from './auth.service';
import { loginRequest, registerRequest } from 'src/interfaces/request';
import { response } from 'src/interfaces/response';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(signInDto: loginRequest, res: any): Promise<response>;
    register(signUpDto: registerRequest): Promise<response>;
    logout(req: any, res: any): Promise<response>;
    getNewAccessToken(req: any, res: any): Promise<response>;
}
