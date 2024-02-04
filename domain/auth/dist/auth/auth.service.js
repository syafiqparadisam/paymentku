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
const refreshToken_service_1 = require("../refreshToken/refreshToken.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, rTokenService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.rTokenService = rTokenService;
        this.configService = configService;
    }
    async generateJWT(payload) {
        return await this.jwtService.signAsync(payload, { secret: this.configService.get("JWT_SECRET") });
    }
    async signInWithGoogle(payload) {
        if (!payload) {
            return {
                statusCode: 400,
                message: "Field is null"
            };
        }
        const findDuplicateUserByEmail = await this.usersService.findUserByEmail(payload.email);
        const findDuplicateUserByUsername = await this.usersService.findUserByUsername(payload.username);
        if (findDuplicateUserByEmail) {
            return {
                statusCode: 409,
                message: `Email ${findDuplicateUserByEmail.email} has been exist`
            };
        }
        if (findDuplicateUserByUsername) {
            return {
                statusCode: 409,
                message: `User ${findDuplicateUserByUsername.user} has been exist`,
            };
        }
        if (!findDuplicateUserByEmail && !findDuplicateUserByUsername) {
            const result = await this.usersService.createAccountWithGoogle(payload);
            if (!result.success) {
                return {
                    statusCode: 500,
                    message: "Server error"
                };
            }
            else {
                const findUser = await this.usersService.findUserByEmail(payload.email);
                const accessToken = await this.generateJWT({ user_id: findUser.id, email: findUser.email });
                const refreshToken = await this.generateJWT({ user_id: findUser.id, email: findUser.email });
                return {
                    statusCode: 200,
                    data: { accessToken, refreshToken },
                    message: "Ok"
                };
            }
        }
        const accessToken = await this.generateJWT({ user_id: findDuplicateUserByUsername.id, email: findDuplicateUserByUsername.email });
        const refreshToken = await this.generateJWT({ user_id: findDuplicateUserByUsername.id, email: findDuplicateUserByUsername.email });
        return {
            statusCode: 200,
            data: { accessToken, refreshToken },
            message: "OK"
        };
    }
    async signIn(payload, cookies) {
        try {
            console.log(payload);
            const user = await this.usersService.findUserByUsername(payload.user);
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
            if (user) {
                const payload = {
                    user_id: user.id,
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
                const findTokenFromCookieAndDelete = await this.rTokenService.findTokenAndDelete(user.refreshToken_id, cookies.refreshToken);
                const findToken = await this.rTokenService.findTokenById(user.refreshToken_id);
                let { success, data } = cookies.refToken ? findTokenFromCookieAndDelete : findToken;
                if (data && success) {
                    const findCookie = await this.rTokenService.findTokenFromToken(cookies.refreshToken);
                    if (!findCookie) {
                        console.log("Where Token Is Come From ?");
                        data = [];
                    }
                    return {
                        statusCode: 204,
                        message: "Delete Cookie"
                    };
                }
                const newRtokenArray = [...data, refreshToken];
                await this.rTokenService.add(user.refreshToken_id, newRtokenArray);
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
                error: err
            };
        }
    }
    async createAccount(data) {
        try {
            const findDuplicateUserByEmail = await this.usersService.findUserByEmail(data.email);
            const findDuplicateUserByUsername = await this.usersService.findUserByUsername(data.user);
            if (findDuplicateUserByEmail) {
                return {
                    statusCode: 409,
                    message: `Email ${findDuplicateUserByEmail.email} has been exist`
                };
            }
            if (findDuplicateUserByUsername) {
                return {
                    statusCode: 409,
                    message: `User ${findDuplicateUserByUsername.user} has been exist`,
                };
            }
            const { success, error } = await this.usersService.createAccount(data);
            if (!success && error) {
                return {
                    statusCode: 500,
                    error: error,
                    message: "Internal Server Error"
                };
            }
            return {
                statusCode: 201,
                message: `User ${data.user} has been succesfully created`,
            };
        }
        catch (err) {
            return {
                statusCode: 500,
                error: err,
            };
        }
    }
    async getNewAccessToken(cookie) {
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
            const user = await this.rTokenService.findTokenFromToken(cookie.refreshToken);
            if (user == null) {
                const decoded = await this.jwtService.verifyAsync(cookie.refreshToken);
                console.log(decoded);
                if (decoded) {
                    const HACKED_USER = await this.usersService.findUserById(decoded.user_id);
                    await this.rTokenService.deleteAllToken(user.data.refreshToken_id);
                    return {
                        statusCode: 204,
                        message: "Delete cookie"
                    };
                }
            }
            else {
                const checkUserIsVerify = await this.jwtService.verifyAsync(cookie.refreshToken);
                console.log(checkUserIsVerify);
                if (!checkUserIsVerify) {
                    await this.rTokenService.deleteToken(user.data.refreshToken_id, cookie.refreshToken);
                    return { statusCode: 204, message: 'No Content' };
                }
                else if (checkUserIsVerify.user === user.data.user &&
                    checkUserIsVerify.email === user.data.email) {
                    const accessToken = await this.jwtService.signAsync({
                        user_id: user.data.id,
                        email: user.data.email,
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
            const user = await this.rTokenService.findTokenFromToken(cookie.refreshToken);
            console.log(user);
            if (!user.data.refreshToken) {
                return {
                    statusCode: 204,
                    message: "token wrong"
                };
            }
            const decode = await this.jwtService.verifyAsync(cookie.refreshToken);
            if (!decode) {
                return { statusCode: 403, message: "cookie wrong" };
            }
            await this.rTokenService.deleteToken(decode.user_id, cookie.refreshToken);
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
        refreshToken_service_1.RefreshTokenService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map