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
    async generateJWT(payload, expiresIn) {
        return await this.jwtService.signAsync(payload, { secret: this.configService.get("JWT_SECRET"), expiresIn });
    }
    async verifyJWT(token) {
        return await this.jwtService.verifyAsync(token, { secret: this.configService.get("JWT_SECRET") });
    }
    async signInWithGoogle(payload, cookies) {
        if (!payload) {
            return {
                statusCode: 400,
                message: "Field is null"
            };
        }
        const findDuplicateUserByEmail = await this.usersService.findUserByEmail(payload.email);
        const findDuplicateUserByUsername = await this.usersService.findUserByUsername(payload.username);
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
                const accessToken = await this.generateJWT({ user_id: findUser.id, email: findUser.email }, 3600 * 24 * 7);
                const refreshToken = await this.generateJWT({ user_id: findUser.id, email: findUser.email }, 3600 * 24 * 30);
                await this.rTokenService.add(findDuplicateUserByUsername.refreshToken_id, refreshToken);
                return {
                    statusCode: 200,
                    data: { accessToken, refreshToken },
                    message: "Ok"
                };
            }
        }
        const userAndprofile = await this.usersService.joiningUserAndProfile(findDuplicateUserByUsername.id);
        console.log(userAndprofile.data.profile.id);
        if (userAndprofile.data.profile.name == null) {
            await this.usersService.updateName(userAndprofile.data.profile.id, payload.name);
        }
        if (userAndprofile.data.profile.photo_profile == null) {
            await this.usersService.updatePhotoProfile(userAndprofile.data.profile.id, payload.picture);
        }
        const accessToken = await this.generateJWT({ user_id: findDuplicateUserByUsername.id, email: findDuplicateUserByUsername.email }, 3600 * 24 * 7);
        const refreshToken = await this.generateJWT({ user_id: findDuplicateUserByUsername.id, email: findDuplicateUserByUsername.email }, 3600 * 24 * 30);
        cookies.refreshToken ? await this.rTokenService.findTokenAndDelete(findDuplicateUserByUsername.refreshToken_id, cookies.refreshToken) : null;
        await this.rTokenService.add(findDuplicateUserByUsername.refreshToken_id, refreshToken);
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
                const accessToken = await this.generateJWT({ user_id: user.id, email: user.email }, 3600 * 24 * 7);
                const refreshToken = await this.generateJWT({ user_id: user.id, email: user.email }, 3600 * 24 * 30);
                cookies.refreshToken ? await this.rTokenService.findTokenAndDelete(user.refreshToken_id, cookies.refreshToken) : null;
                console.log(cookies.refreshToken);
                await this.rTokenService.add(user.refreshToken_id, refreshToken);
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
        console.log(data);
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
            const { success, data: error } = await this.usersService.createAccount(data);
            console.log({ success, error });
            if (!success) {
                return {
                    statusCode: 500,
                    error,
                    message: "Internal Server Error"
                };
            }
            console.log(success);
            return {
                statusCode: 201,
                message: `User ${data.user} has been succesfully created`,
            };
        }
        catch (err) {
            console.log(err);
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
            const arrRefTokenUser = await this.rTokenService.findTokenFromToken(cookie.refreshToken);
            console.log(arrRefTokenUser);
            if (!arrRefTokenUser.data) {
                return {
                    statusCode: 204,
                    message: "Delete cookie"
                };
            }
            const user = await this.usersService.findUserByRefreshTokenId(arrRefTokenUser.data._id.toString());
            if (user == null) {
                return {
                    statusCode: 204,
                    message: "Delete cookie"
                };
            }
            else {
                const checkUserIsVerify = await this.verifyJWT(cookie.refreshToken);
                console.log(checkUserIsVerify);
                if (!checkUserIsVerify) {
                    return { statusCode: 403, message: 'User found but this token is wrong' };
                }
                else if (checkUserIsVerify.user_id === user.id &&
                    checkUserIsVerify.email === user.email) {
                    const accessToken = await this.generateJWT({ user_id: checkUserIsVerify.user_id, email: checkUserIsVerify.email }, 3600 * 24 * 7);
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
        if (!cookie.refreshToken || cookie.refreshToken == null) {
            return {
                statusCode: 403,
                message: "User don't have refreshToken but tried to logout"
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
            const decode = await this.verifyJWT(cookie.refreshToken);
            if (!decode.user_id && !decode.email) {
                return { statusCode: 403, message: "refresh token is wrong" };
            }
            await this.rTokenService.deleteToken(user.data._id, cookie.refreshToken);
            return {
                statusCode: 204,
                message: "refresh token have been deleting now"
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