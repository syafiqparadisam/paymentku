"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("./users/schemas/users.entity");
const refreshToken_module_1 = require("./refreshToken/refreshToken.module");
const mongorepo_module_1 = require("./mongorepo/mongorepo.module");
const profile_entity_1 = require("./users/schemas/profile.entity");
const history_topup_entity_1 = require("./users/schemas/history_topup.entity");
const history_transfer_entity_1 = require("./users/schemas/history_transfer.entity");
const access_token_guard_module_1 = require("./access-token-guard/access-token-guard.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                entities: [users_entity_1.Users, profile_entity_1.Profile, history_topup_entity_1.HistoryTopup, history_transfer_entity_1.HistoryTransfer],
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'root',
                database: 'paymentku',
                synchronize: true,
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            refreshToken_module_1.RefreshTokenModule,
            mongorepo_module_1.MongorepoModule,
            access_token_guard_module_1.AccessTokenGuardModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map