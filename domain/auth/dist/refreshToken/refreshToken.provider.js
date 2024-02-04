"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenProviders = void 0;
const refreshToken_schema_1 = require("./schemas/refreshToken.schema");
exports.RefreshTokenProviders = [
    {
        provide: "REF_TOKEN_MODEL",
        useFactory: (connection) => connection.model("REFRESH_TOKEN", refreshToken_schema_1.RefreshTokenSchema),
        inject: ["DATABASE_CONNECTION"],
    },
];
//# sourceMappingURL=refreshToken.provider.js.map