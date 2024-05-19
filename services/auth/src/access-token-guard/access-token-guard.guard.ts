import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '../redis/redis.service';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import * as crypto from 'node:crypto';

@Injectable()
export class AccessTokenGuardGuard implements CanActivate {
  constructor(private redisService: RedisService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();
    return this.handleVerifyToken(http);
  }

  private async handleVerifyToken(http: HttpArgumentsHost): Promise<boolean> {
    const request = http.getRequest();
    const authToken: string = request.cookies.authToken;
    try {
      console.log(request.cookies);
      const randomLockKey = crypto.randomUUID();
      if (!authToken) {
        throw new UnauthorizedException("User haven't yet signin");
      }
      const userid = await this.redisService.getUserIdByAuthToken(authToken, [
        randomLockKey,
      ]);
      if (!userid) {
        throw new ForbiddenException('User not found');
      }
      console.log(userid);
      await this.redisService.decreaseExpireAuthToken(authToken, [
        randomLockKey,
      ]);
      console.log('userid = ', userid);
      request.user_id = userid;
      return true;
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
