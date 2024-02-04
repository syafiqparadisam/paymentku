import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { jwtPayload } from "src/interfaces/jwtPayload";
import { UsersService } from "src/users/users.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private userService;
    constructor(configService: ConfigService, userService: UsersService);
    validate(payload: jwtPayload): Promise<{
        id: number;
        email: string;
    }>;
}
export {};
