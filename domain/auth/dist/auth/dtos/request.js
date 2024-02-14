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
exports.loginWithGoogle = exports.loginRequest = exports.registerRequest = void 0;
const class_validator_1 = require("class-validator");
class registerRequest {
}
exports.registerRequest = registerRequest;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], registerRequest.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], registerRequest.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], registerRequest.prototype, "email", void 0);
class loginRequest {
}
exports.loginRequest = loginRequest;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], loginRequest.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], loginRequest.prototype, "password", void 0);
class loginWithGoogle {
}
exports.loginWithGoogle = loginWithGoogle;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], loginWithGoogle.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], loginWithGoogle.prototype, "providerID", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], loginWithGoogle.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], loginWithGoogle.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], loginWithGoogle.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], loginWithGoogle.prototype, "picture", void 0);
//# sourceMappingURL=request.js.map