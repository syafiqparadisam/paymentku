import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { jwtPayload } from 'src/interfaces/jwtPayload';
import * as jwt from "jsonwebtoken"

@Injectable()
export class AccessTokenGuardGuard implements CanActivate {
  constructor(
    private jwtService: JwtService
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    try {


      const headerAuth: string = request.headers.authorization || request.headers.Authorization
      console.log(headerAuth)
      if (!headerAuth || !headerAuth.startsWith("Bearer ")) {
        throw new UnauthorizedException("Please include access token before access this route")
      }

      const token = headerAuth.split(" ")[1]
      // validate token
      const decode: jwtPayload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET })
      if (!decode.email && !decode.user_id) {
        console.log("IS HERE")
        throw new ForbiddenException("Your token is invalid or wrong")
      }
      request.user_id = decode.user_id
      request.email = decode.email

      return true
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new ForbiddenException(error.message)
      } else {
        throw error
      }
    }
  }
}
