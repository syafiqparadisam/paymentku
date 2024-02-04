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
const users_entity_1 = require("./schemas/users.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const CreateAccNumber_1 = require("./utils/CreateAccNumber");
const randNum_1 = require("./utils/randNum");
const profile_entity_1 = require("./schemas/profile.entity");
let UsersService = class UsersService {
    constructor(repository) {
        this.repository = repository;
    }
    async findByNumber(accNumber) {
        return this.repository.findBy({ accountNumber: accNumber });
    }
    async createAccount(data) {
        try {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(data.password, salt);
            const accNumber = await (0, CreateAccNumber_1.createAccountNumber)();
            const profile = new profile_entity_1.Profile();
            profile.name = data.user + (0, randNum_1.default)().toString();
            await this.repository.insert({
                user: data.user,
                email: data.email,
                password,
                accountNumber: accNumber,
                profile
            });
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    findUserById(id) {
        return this.repository.findOne({ where: { id } });
    }
    findUserByEmail(email) {
        return this.repository.findOne({ where: { email } });
    }
    findUserByUsername(user) {
        return this.repository.findOne({ where: { user } });
    }
    async createAccountWithGoogle(user) {
        const accNumber = await (0, CreateAccNumber_1.createAccountNumber)();
        const profile = new profile_entity_1.Profile();
        profile.name = user.name;
        profile.photo_profile = user.picture;
        try {
            await this.repository.insert({ user: user.username, email: user.email, accountNumber: accNumber, profile: profile });
            return { success: true };
        }
        catch (error) {
            console.log(error);
            return { success: false };
        }
    }
    comparePassword(passwordFromPayload, passFromFindData) {
        return bcrypt.compare(passwordFromPayload, passFromFindData);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map