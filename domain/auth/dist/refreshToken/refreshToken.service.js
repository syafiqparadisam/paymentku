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
exports.RefreshTokenService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
let RefreshTokenService = class RefreshTokenService {
    constructor(rtModel) {
        this.rtModel = rtModel;
    }
    async insert(id, token) {
        const result = new this.rtModel({ id: id, refreshToken: token });
        try {
            await result.save();
            return { success: true };
        }
        catch (error) {
            console.log(error);
            return { success: false };
        }
    }
    async findTokenAndDelete(id, token) {
        try {
            await this.rtModel.updateOne({ id }, { $pull: { refreshToken: token } });
            const user = await this.rtModel.findOne({ id }, { refreshToken: 1, id: 0 });
            return { data: user, success: true };
        }
        catch (error) {
            console.log(error);
            return { success: false };
        }
    }
    async findTokenFromToken(token) {
        try {
            const result = await this.rtModel.findOne({ refreshToken: token }, { id: 0, refreshToken: 1 });
            return { data: result, success: true };
        }
        catch (error) {
            console.log(error);
            return { success: false };
        }
    }
    async add(id, token) {
        const result = await this.rtModel.updateOne({ id }, { $push: { refreshToken: { $each: token } } });
        if (result.modifiedCount > 0) {
            return { success: true };
        }
        else if (result.modifiedCount == 0) {
            return { success: false };
        }
    }
    async findTokenById(id) {
        try {
            const result = await this.rtModel.findOne({ id }, { id: 0, refreshToken: 1 });
            return { data: result, success: true };
        }
        catch (error) {
            console.log(error);
            return { success: false };
        }
    }
    async deleteAllToken(id) {
        try {
            await this.rtModel.updateOne({ id }, { refreshToken: [] });
            return { success: true };
        }
        catch (error) {
            console.log(error);
            return { success: false };
        }
    }
    async deleteToken(id, token) {
        const result = await this.rtModel.updateOne({ id }, { $pull: { refreshToken: token } });
        if (result.modifiedCount > 0) {
            return { success: true };
        }
        else if (result.modifiedCount == 0) {
            return { success: false };
        }
    }
};
exports.RefreshTokenService = RefreshTokenService;
exports.RefreshTokenService = RefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("REF_TOKEN_MODEL")),
    __metadata("design:paramtypes", [mongoose_1.Model])
], RefreshTokenService);
//# sourceMappingURL=refreshToken.service.js.map