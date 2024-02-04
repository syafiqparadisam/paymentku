"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenModule = void 0;
const common_1 = require("@nestjs/common");
const refreshToken_service_1 = require("./refreshToken.service");
const refreshToken_provider_1 = require("./refreshToken.provider");
const mongorepo_module_1 = require("../mongorepo/mongorepo.module");
let RefreshTokenModule = class RefreshTokenModule {
};
exports.RefreshTokenModule = RefreshTokenModule;
exports.RefreshTokenModule = RefreshTokenModule = __decorate([
    (0, common_1.Module)({
        imports: [mongorepo_module_1.MongorepoModule],
        providers: [refreshToken_service_1.RefreshTokenService, ...refreshToken_provider_1.RefreshTokenProviders],
        exports: [refreshToken_service_1.RefreshTokenService]
    })
], RefreshTokenModule);
//# sourceMappingURL=refreshToken.module.js.map