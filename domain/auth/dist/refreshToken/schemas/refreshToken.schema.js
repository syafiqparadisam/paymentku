"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenSchema = void 0;
const mongoose = require("mongoose");
exports.RefreshTokenSchema = new mongoose.Schema({
    user_id: Number,
    refreshToken: [String]
});
//# sourceMappingURL=refreshToken.schema.js.map