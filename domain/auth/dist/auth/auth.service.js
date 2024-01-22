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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async signIn(payload) {
        try {
            const user = await this.usersService.findUser(payload.user);
            console.log(user);
            if (user == null) {
                return {
                    statusCode: 400,
                    message: 'Wrong Username or Password',
                };
            }
            const comparePass = await this.usersService.comparePassword(payload.password, user.password);
            console.log(comparePass);
            if (comparePass == false) {
                return {
                    statusCode: 400,
                    message: 'Wrong Username or Password',
                };
            }
            else {
                const payload = {
                    user: user.user,
                    email: user.email,
                };
                const secret = this.configService.get('JWT_SECRET');
                console.log(payload);
                const accessToken = await this.jwtService.signAsync(payload, {
                    secret: secret,
                    expiresIn: 3600 * 24 * 7,
                });
                const refreshToken = await this.jwtService.signAsync(payload, {
                    secret,
                    expiresIn: 3600 * 24 * 30,
                });
                await this.usersService.addRefreshToken(refreshToken, payload.user);
                return {
                    statusCode: 200,
                    data: { accessToken, refreshToken },
                    message: 'Ok',
                };
            }
        }
        catch (err) {
            return {
                statusCode: 400,
                data: null,
                message: err,
            };
        }
    }
    async createAccount(data) {
        try {
            const findDuplicateUser = await this.usersService.findUser(data.user);
            if (findDuplicateUser) {
                return {
                    statusCode: 409,
                    message: `User ${data.user} has been exist`,
                };
            }
            else {
                await this.usersService.createAccount(data);
                return {
                    statusCode: 201,
                    message: `User ${data.user} has been succesfully created`,
                };
            }
        }
        catch (err) {
            return {
                statusCode: 400,
                data: null,
                message: err,
            };
        }
    }
    async getNewRefreshToken(cookie) {
        if (!cookie.refreshToken) {
            return {
                statusCode: 401,
                message: 'Unauthorized',
            };
        }
        try {
            console.log(cookie);
            const secret = this.configService.get('JWT_SECRET');
            console.log(secret);
            const user = await this.usersService.findRefreshToken(cookie.refreshToken);
            if (user == null) {
                return { statusCode: 400, message: 'Bad Request' };
            }
            else {
                const checkUserIsVerify = await this.jwtService.verifyAsync(cookie.refreshToken, { secret: secret });
                console.log(checkUserIsVerify);
                if (!checkUserIsVerify) {
                    await this.usersService.deleteRefreshToken(user.user);
                    return { statusCode: 204, message: 'No Content' };
                }
                else if (checkUserIsVerify.user === user.user &&
                    checkUserIsVerify.email === user.email) {
                    console.log('ishere');
                    const accessToken = await this.jwtService.signAsync({
                        user: user.user,
                        email: user.email,
                    }, {
                        secret,
                        expiresIn: 3600 * 24 * 7,
                    });
                    console.log(accessToken);
                    return {
                        statusCode: 200,
                        data: {
                            accessToken,
                        },
                        message: 'Ok',
                    };
                }
            }
        }
        catch (error) {
            return {
                statusCode: 500,
                message: error,
            };
        }
    }
    async logout(cookie) {
        if (!cookie.refreshToken) {
            return {
                statusCode: 204,
            };
        }
        try {
            const user = await this.usersService.findRefreshToken(cookie.refreshToken);
            console.log(user);
            if (user.refreshToken === null) {
                return {
                    statusCode: 204,
                };
            }
            await this.usersService.deleteRefreshToken(user.user);
            return {
                statusCode: 204,
            };
        }
        catch (error) {
            return {
                statusCode: 400,
                message: error,
            };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map