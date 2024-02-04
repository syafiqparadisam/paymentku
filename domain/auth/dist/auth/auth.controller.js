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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const request_js_1 = require("./dtos/request.js");
const google_oauth_guard_1 = require("./guards/google-oauth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto, req, res) {
        const { data, message, statusCode, error } = await this.authService.signIn(loginDto, req.cookies);
        if (statusCode === 200) {
            res.cookie('refreshToken', data.refreshToken, {
                expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });
            return res.status(statusCode).json({
                statusCode: 200,
                data: { accessToken: data.accessToken },
                message,
                error
            });
        }
        else if (statusCode == 204) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });
            return res.status(statusCode).json(data);
        }
        else {
            return res.status(statusCode).json({ statusCode: statusCode, data, message });
        }
    }
    async auth() { }
    async googleAuthCallback(req, res) {
        const result = await this.authService.signInWithGoogle(req.user);
        if (result.statusCode != 200) {
            return res.status(result.statusCode).json(result);
        }
        res.cookie('refreshToken', result.data.refreshToken, {
            expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return res.status(result.statusCode).json({
            statusCode: result.statusCode,
            data: { accessToken: result.data.accessToken },
            message: result.message
        });
    }
    async register(registerDto, res) {
        const { data, message, statusCode, error } = await this.authService.createAccount(registerDto);
        if (statusCode == 200) {
            return res.status(statusCode).json({
                statusCode,
                data,
                message,
                error
            });
        }
        return res.status(statusCode).json({
            statusCode,
            data,
            message,
            error
        });
    }
    async logout(req, res) {
        console.log(req.cookies);
        const result = await this.authService.logout(req.cookies);
        if (result.statusCode === 204) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            return res.sendStatus(204);
        }
        else {
            return res.status(result.statusCode).json(result);
        }
    }
    async getNewAccessToken(req, res) {
        const result = await this.authService.getNewAccessToken(req.cookies);
        if (result.statusCode === 204) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            return res.sendStatus(204);
        }
        else {
            return res.status(result.statusCode).json(result);
        }
    }
    async verifyUser(req) {
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_js_1.loginRequest, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)(google_oauth_guard_1.GoogleOauthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "auth", null);
__decorate([
    (0, common_1.Get)('/auth/login/google'),
    (0, common_1.UseGuards)(google_oauth_guard_1.GoogleOauthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthCallback", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(201),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_js_1.registerRequest, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Delete)('/logout'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getNewAccessToken", null);
__decorate([
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyUser", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map