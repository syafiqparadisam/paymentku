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
const mongodb_1 = require("mongodb");
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
    async insertJustUserId(refreshTokenId, user_id) {
        try {
            const data = await this.rtModel.updateOne({ _id: refreshTokenId }, { user_id });
            return { success: true };
        }
        catch (error) {
            return { success: false, data: error };
        }
    }
    async initAndFind() {
        try {
            const newDocument = new this.rtModel();
            await newDocument.save();
            const findId = await this.rtModel.findOne({ _id: newDocument._id });
            return { success: true, data: findId };
        }
        catch (error) {
            return { success: false, data: error };
        }
    }
    async getIdRefreshTokenByUserId(userid) {
        try {
            const result = await this.rtModel.findOne({ user_id: userid });
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, data: error };
        }
    }
    async findTokenAndDelete(id, token) {
        try {
            await this.rtModel.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $pull: { refreshToken: token } });
            return { success: true };
        }
        catch (error) {
            console.log(error);
            return { success: false };
        }
    }
    async findTokenFromToken(token) {
        try {
            const result = await this.rtModel.findOne({ refreshToken: token });
            return { data: result, success: true };
        }
        catch (error) {
            console.log(error);
            return { success: false };
        }
    }
    async add(id, token) {
        try {
            const result = await this.rtModel.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $push: { refreshToken: token } });
            if (result.modifiedCount > 0) {
                return { success: true };
            }
            else if (result.modifiedCount == 0) {
                return { success: false };
            }
        }
        catch (error) {
            return { success: false, data: error };
        }
    }
    async findTokenById(id) {
        try {
            const result = await this.rtModel.findOne({ _id: id }, { id: 0, refreshToken: 1 });
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
        console.log({ id, token });
        try {
            const result = await this.rtModel.updateOne({ _id: id }, { $pull: { refreshToken: token } });
            if (result.modifiedCount > 0) {
                return { success: true };
            }
            else if (result.modifiedCount == 0) {
                return { success: false };
            }
        }
        catch (error) {
            return { success: false, data: error };
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