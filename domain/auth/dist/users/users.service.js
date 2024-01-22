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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("./users.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const generateAccNumber_1 = require("./utils/generateAccNumber");
let UsersService = class UsersService {
    constructor(repository) {
        this.repository = repository;
    }
    async findByNumber(accNumber) {
        return this.repository.findBy({ accountNumber: accNumber });
    }
    async createAccount(data) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(data.password, salt);
        let accNumber;
        while (true) {
            const randNum = (0, generateAccNumber_1.default)();
            const user = await this.findByNumber(randNum);
            if (user.length === 0) {
                accNumber = randNum;
                break;
            }
        }
        await this.repository.insert({
            user: data.user,
            password: password,
            email: data.email,
            accountNumber: accNumber,
        });
    }
    findUser(user) {
        return this.repository.findOne({ where: { user } });
    }
    findRefreshToken(token) {
        console.log(token);
        return this.repository.findOne({ where: { refreshToken: token } });
    }
    comparePassword(passwordFromPayload, passFromFindData) {
        return bcrypt.compare(passwordFromPayload, passFromFindData);
    }
    async addRefreshToken(token, user) {
        await this.repository.update({ user: user }, { refreshToken: token });
    }
    async deleteRefreshToken(user) {
        await this.repository.update({ user }, { refreshToken: null });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map