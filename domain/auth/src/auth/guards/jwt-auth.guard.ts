import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { jwtPayload } from "src/interfaces/jwtPayload";

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        try {


            const headerAuth: string = request.headers.authorization || request.headers.Authorization

            if (!headerAuth || !headerAuth.startsWith("Bearer ")) {
                throw new UnauthorizedException("Please include access token before access this route")
            }

            const token = headerAuth.split(" ")[1]
            // validate token
            const decode: jwtPayload = this.jwtService.verify(token)
            if (!decode) {
                throw new ForbiddenException("Your token is invalid or wrong")
            }
            request.user_id = decode.user_id
            request.email = decode.email

            return true
        } catch (error) {
            return error
        }
    }
}