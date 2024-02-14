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
const randNum_1 = require("./utils/randNum");
const profile_entity_1 = require("./schemas/profile.entity");
const refreshToken_service_1 = require("../refreshToken/refreshToken.service");
const history_topup_entity_1 = require("./schemas/history_topup.entity");
const history_transfer_entity_1 = require("./schemas/history_transfer.entity");
let UsersService = class UsersService {
    constructor(userRepo, profileRepo, historyTopUpRepo, historyTransferRepo, mongorToken) {
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
        this.historyTopUpRepo = historyTopUpRepo;
        this.historyTransferRepo = historyTransferRepo;
        this.mongorToken = mongorToken;
    }
    generateAccountNumber() {
        return Math.floor(Math.random() * 9999999999) + 1;
    }
    async findAccNumber(accNumber) {
        return this.userRepo.find({ where: { accountNumber: accNumber } });
    }
    async createAccountNumber() {
        let accNumber;
        while (true) {
            const randNum = (0, randNum_1.default)();
            const user = await this.findAccNumber(randNum);
            if (user.length === 0) {
                accNumber = randNum;
                break;
            }
        }
        return accNumber;
    }
    async createAccount(data) {
        try {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(data.password, salt);
            const accNumber = await this.createAccountNumber();
            const profile = new profile_entity_1.Profile();
            profile.name = data.user + (0, randNum_1.default)().toString();
            await this.profileRepo.save(profile);
            const userInMongo = await this.mongorToken.initAndFind();
            await this.userRepo.insert({
                user: data.user,
                email: data.email,
                password,
                refreshToken_id: userInMongo.data._id.toString(),
                accountNumber: accNumber,
                profile
            });
            return { success: true };
        }
        catch (error) {
            return { success: false, data: error };
        }
    }
    findUserById(id) {
        return this.userRepo.findOne({ where: { id } });
    }
    findUserByEmail(email) {
        return this.userRepo.findOne({ where: { email } });
    }
    findUserByUsername(user) {
        return this.userRepo.findOne({ where: { user } });
    }
    findUserByRefreshTokenId(token_id) {
        return this.userRepo.findOne({ where: { refreshToken_id: token_id } });
    }
    async updateName(profileId, name) {
        console.log(name);
        try {
            await this.profileRepo.update({ id: profileId }, { name: name.givenName + " " + name.familyName });
            return { success: true };
        }
        catch (error) {
            return { success: false, data: error };
        }
    }
    async joiningUserAndProfile(userId) {
        try {
            console.log(userId);
            const JoininguserAndProfile = await this.userRepo.createQueryBuilder('users').leftJoinAndSelect("users.profile", "profile").getOne();
            console.log(JoininguserAndProfile);
            return { success: true, data: JoininguserAndProfile };
        }
        catch (error) {
            return { success: false, data: error };
        }
    }
    async updatePhotoProfile(profileId, photo_profile) {
        console.log(photo_profile);
        try {
            await this.profileRepo.update({ id: profileId }, { photo_profile });
            return { success: true };
        }
        catch (error) {
            return { success: false, data: error };
        }
    }
    async createAccountWithGoogle(user) {
        try {
            const accNumber = await this.createAccountNumber();
            const profile = new profile_entity_1.Profile();
            profile.name = user.name.givenName + " " + user.name.familyName;
            profile.photo_profile = user.picture;
            await this.profileRepo.save(profile);
            const userInMongo = await this.mongorToken.initAndFind();
            await this.userRepo.insert({
                user: user.username,
                email: user.email,
                refreshToken_id: userInMongo.data._id.toString(),
                accountNumber: accNumber,
                profile: profile
            });
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
    __param(1, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __param(2, (0, typeorm_1.InjectRepository)(history_topup_entity_1.HistoryTopup)),
    __param(3, (0, typeorm_1.InjectRepository)(history_transfer_entity_1.HistoryTransfer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        refreshToken_service_1.RefreshTokenService])
], UsersService);
//# sourceMappingURL=users.service.js.map