// jwt.strategy.ts
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET, // Ganti dengan secret key JWT Anda
        });
    }

    async validate(payload: any) {
        // Di sini, Anda dapat menyesuaikan logika validasi payload token JWT
        // Misalnya, memeriksa apakah pengguna ada di sistem Anda.
        // Jika valid, kembalikan objek pengguna; jika tidak, lempar UnauthorizedException.
        if (!payload || payload == "") {
            throw new UnauthorizedException();
        }
        const findUser = await this.usersService.findUserById(payload.user_id)
        if (payload.user_id === findUser.id && payload.email === findUser.email) {
            return {
                statusCode: 302,
                data: payload,
                message: "Redirected"
            }
        } else {
            throw new ForbiddenException()
        }
    }
}
