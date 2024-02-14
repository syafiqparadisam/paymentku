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
exports.HistoryTransfer = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./users.entity");
let HistoryTransfer = class HistoryTransfer {
};
exports.HistoryTransfer = HistoryTransfer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HistoryTransfer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.Users, users => users.history_transfer_id),
    __metadata("design:type", users_entity_1.Users)
], HistoryTransfer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HistoryTransfer.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HistoryTransfer.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", nullable: true }),
    __metadata("design:type", Number)
], HistoryTransfer.prototype, "receiver_account", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HistoryTransfer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], HistoryTransfer.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HistoryTransfer.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], HistoryTransfer.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], HistoryTransfer.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], HistoryTransfer.prototype, "createdAt", void 0);
exports.HistoryTransfer = HistoryTransfer = __decorate([
    (0, typeorm_1.Entity)()
], HistoryTransfer);
//# sourceMappingURL=history_transfer.entity.js.map