import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { jwtPayload } from "src/interfaces/jwtPayload";
import { UsersService } from "src/users/users.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(
        private readonly configService: ConfigService,
        private userService: UsersService
    ) {
        const extractJWTFromCookie = (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies['access_token'];
            }
            return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        }

        super({
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_SECRET"),
            jwtFromRequest: extractJWTFromCookie
        })
    }

    async validate(payload: jwtPayload) {
        const user = await this.userService.findUserById(payload.user_id)
        if (!user) {
            throw new UnauthorizedException("please login first")
        }
        return {
            id: payload.user_id,
            email: payload.email
        }
    }
}