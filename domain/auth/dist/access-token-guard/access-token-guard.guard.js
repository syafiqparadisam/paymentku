"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenGuardGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jwt = require("jsonwebtoken");
let AccessTokenGuardGuard = class AccessTokenGuardGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        try {
            const headerAuth = request.headers.authorization || request.headers.Authorization;
            console.log(headerAuth);
            if (!headerAuth || !headerAuth.startsWith("Bearer ")) {
                throw new common_1.UnauthorizedException("Please include access token before access this route");
            }
            const token = headerAuth.split(" ")[1];
            const decode = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            if (!decode.email && !decode.user_id) {
                console.log("IS HERE");
                throw new common_1.ForbiddenException("Your token is invalid or wrong");
            }
            request.user_id = decode.user_id;
            request.email = decode.email;
            return true;
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new common_1.UnauthorizedException(error.message);
            }
            else if (error instanceof jwt.TokenExpiredError) {
                throw new common_1.ForbiddenException(error.message);
            }
            else {
                throw error;
            }
        }
    }
};
exports.AccessTokenGuardGuard = AccessTokenGuardGuard;
exports.AccessTokenGuardGuard = AccessTokenGuardGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AccessTokenGuardGuard);
//# sourceMappingURL=access-token-guard.guard.js.map