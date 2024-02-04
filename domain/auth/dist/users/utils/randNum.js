"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
function generateRandNum() {
    const buffer = crypto.randomBytes(4);
    const uniqueRandom = buffer.readUInt32LE(0);
    return uniqueRandom;
}
exports.default = generateRandNum;
//# sourceMappingURL=randNum.js.map